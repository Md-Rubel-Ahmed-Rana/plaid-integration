import { plaidClient } from "@/config/plaid";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import { PayoutAccountService } from "../payout-account/payout-account.service";
import {
  BankAccountModel,
  PlaidItemModel,
} from "../payout-account/payout-account.model";

class Service {
  async createLinkToken(userEmail: string) {
    try {
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: this.cleanUpEmail(userEmail),
        },
        client_name: "Plaid Integration",
        products: ["auth"] as any,
        country_codes: ["US"] as any,
        language: "en",
      });
      return {
        link_token: response.data.link_token,
      };
    } catch (error: any) {
      console.log(error);
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.response?.data || error?.message
      );
    }
  }

  private cleanUpEmail(email: string) {
    return email.split("@")[0];
  }

  async exchangePublicToken(
    public_token: string,
    userEmail: string,
    institution: {
      institution_id: string;
      institution_name: string;
    }
  ) {
    if (!public_token) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Public token is required"
      );
    }

    const existingItem = await PlaidItemModel.findOne({
      email: userEmail,
      institution_id: institution.institution_id,
    });

    try {
      const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token,
      });

      const access_token = exchangeResponse.data.access_token;

      const authResponse = await plaidClient.authGet({
        access_token,
      });

      const accounts = authResponse.data.accounts;
      const numbers = authResponse.data.numbers;
      const item = authResponse.data.item;

      if (existingItem) {
        const newAccounts = [];

        for (const account of accounts) {
          const fingerprint = this.generateAccountFingerprint(
            institution,
            account.name
          );
          const isAccountExist = await BankAccountModel.findOne({
            fingerprint,
          });

          if (isAccountExist) continue;

          newAccounts.push(account);
        }

        if (!newAccounts.length) {
          throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "Your selected bank account(s) already exist"
          );
        }

        await PayoutAccountService.createOnExistingPlaidItem(
          existingItem._id,
          newAccounts,
          numbers,
          item,
          userEmail
        );

        return {
          accounts: newAccounts,
          numbers,
          item,
        };
      }

      const payload = {
        accounts,
        numbers,
        item,
        access_token,
      };

      await PayoutAccountService.create(userEmail, payload);

      return payload;
    } catch (error: any) {
      console.log(error);
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.response?.data || error?.message
      );
    }
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

export const PlaidService = new Service();
