import { plaidClient } from "@/config/plaid";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import { PayoutAccountService } from "../payout-account/payout-account.service";
import { PlaidItemModel } from "../payout-account/payout-account.model";

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
    institution: { institution_id: string; institution_name: string }
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

    if (existingItem) {
      throw new ApiError(
        HttpStatusCode.CONFLICT,
        `You have already added the "${institution.institution_name}" account`
      );
    }

    //TODO: We also need to verify sub account is exist or not

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

      //TODO: We also need to verify sub account is exist or not

      const payload = {
        accounts,
        numbers,
        item,
        access_token,
      };

      await PayoutAccountService.create(userEmail, payload);

      return payload;
    } catch (error: any) {
      console.log(error.response?.data || error);
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error.response?.data || error?.message
      );
    }
  }
}

export const PlaidService = new Service();
