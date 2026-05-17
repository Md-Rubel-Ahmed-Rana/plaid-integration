import mongoose, { Types } from "mongoose";
import { CryptoInstance } from "@/lib/crypto";
import {
  BankAccountModel,
  BankAccountNumberModel,
  PlaidItemModel,
} from "./payout-account.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  async create(userEmail: string, payload: any) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const { access_token, item, accounts, numbers } = payload;

      const existingItem = await PlaidItemModel.findOne({
        email: userEmail,
        institution_id: item.institution_id,
      });

      if (existingItem) {
        throw new ApiError(
          HttpStatusCode.CONFLICT,
          `You have already added the "${item.institution_name}" account`
        );
      }

      const plaidItem = await PlaidItemModel.create(
        [
          {
            email: userEmail,

            access_token: CryptoInstance.encrypt(access_token),

            item_id: item.item_id,

            institution_id: item.institution_id,
            institution_name: item.institution_name,
          },
        ],
        { session }
      );

      const plaidItemDoc = plaidItem[0];

      const achMap = new Map();

      for (const ach of numbers?.ach || []) {
        achMap.set(ach.account_id, ach);
      }

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];

        const fingerprint = this.generateAccountFingerprint(
          {
            institution_id: item.institution_id,
            institution_name: item.institution_name,
          },
          account.name
        );

        const bankAccount = await BankAccountModel.create(
          [
            {
              email: userEmail,

              plaidItem: plaidItemDoc._id,
              fingerprint: fingerprint,

              account_id: account.account_id,

              name: account.name,
              official_name: account.official_name,

              type: account.type,
              subtype: account.subtype,

              mask: account.mask,
              holder_category: account.holder_category,

              balances: {
                available: account.balances.available,
                current: account.balances.current,
                limit: account.balances.limit,
                iso_currency_code: account.balances.iso_currency_code,
              },

              is_default_payout: i === 0,

              verification_status: "verified",

              last_verified_at: new Date(),
            },
          ],
          { session }
        );

        const bankAccountDoc = bankAccount[0];

        const ach = achMap.get(account.account_id);

        if (ach) {
          await BankAccountNumberModel.create(
            [
              {
                account: bankAccountDoc._id,

                encrypted_account_number: CryptoInstance.encrypt(ach.account),

                encrypted_routing_number: CryptoInstance.encrypt(ach.routing),

                encrypted_wire_routing: ach.wire_routing
                  ? CryptoInstance.encrypt(ach.wire_routing)
                  : undefined,

                scheme: "ach",

                is_tokenized_account_number: ach.is_tokenized_account_number,
              },
            ],
            { session }
          );
        }
      }

      await session.commitTransaction();

      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async createOnExistingPlaidItem(
    plaidItemId: Types.ObjectId,
    accounts: any,
    numbers: any,
    item: any,
    userEmail: string
  ) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const achMap = new Map();

      for (const ach of numbers?.ach || []) {
        achMap.set(ach.account_id, ach);
      }

      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];

        const fingerprint = this.generateAccountFingerprint(
          {
            institution_id: item.institution_id,
            institution_name: item.institution_name,
          },
          account.name
        );
        const bankAccount = await BankAccountModel.create(
          [
            {
              email: userEmail,

              plaidItem: plaidItemId,
              fingerprint: fingerprint,

              account_id: account.account_id,

              name: account.name,
              official_name: account.official_name,

              type: account.type,
              subtype: account.subtype,

              mask: account.mask,
              holder_category: account.holder_category,

              balances: {
                available: account.balances.available,
                current: account.balances.current,
                limit: account.balances.limit,
                iso_currency_code: account.balances.iso_currency_code,
              },

              is_default_payout: i === 0,

              verification_status: "verified",

              last_verified_at: new Date(),
            },
          ],
          { session }
        );

        const bankAccountDoc = bankAccount[0];

        const ach = achMap.get(account.account_id);

        if (ach) {
          await BankAccountNumberModel.create(
            [
              {
                account: bankAccountDoc._id,

                encrypted_account_number: CryptoInstance.encrypt(ach.account),

                encrypted_routing_number: CryptoInstance.encrypt(ach.routing),

                encrypted_wire_routing: ach.wire_routing
                  ? CryptoInstance.encrypt(ach.wire_routing)
                  : undefined,

                scheme: "ach",

                is_tokenized_account_number: ach.is_tokenized_account_number,
              },
            ],
            { session }
          );
        }
      }

      await session.commitTransaction();

      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getUserAccounts(userEmail: string) {
    const items = await PlaidItemModel.find({ email: userEmail })
      .select("institution_name institution_id item_id createdAt")
      .lean();

    const accounts = await BankAccountModel.find({ email: userEmail })
      .select(
        "plaidItem name official_name account_id type subtype mask balances isActive is_default_payout"
      )
      .lean();

    const grouped = items.map((item) => {
      const itemAccounts = accounts
        .filter((acc) => acc.plaidItem.toString() === item._id.toString())
        .map((acc) => ({
          id: acc.account_id,
          name: acc.name,
          official_name: acc.official_name,
          type: acc.type,
          subtype: acc.subtype,
          mask: acc.mask,

          balance: {
            available: acc.balances?.available,
            current: acc.balances.current,
            currency: acc.balances.iso_currency_code,
          },
          is_active: acc.is_active,
          is_default_payout: acc.is_default_payout,
        }));

      return {
        id: item._id,
        institution_id: item.institution_id,
        institution_name: item.institution_name,
        item_id: item.item_id,
        createdAt: item.createdAt,

        accounts: itemAccounts,
      };
    });

    return grouped;
  }

  generateAccountFingerprint = (
    institution: { institution_id: string; institution_name: string },
    accountName: string
  ) => {
    const normalize = (value: string) => {
      return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/gi, "");
    };

    return [
      normalize(institution.institution_name),
      normalize(institution.institution_id),
      normalize(accountName),
    ].join("-");
  };
}

export const PayoutAccountService = new Service();
