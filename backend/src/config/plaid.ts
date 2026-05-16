import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { envConfig } from ".";

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": envConfig.plaid.client_id,
      "PLAID-SECRET": envConfig.plaid.secret,
    },
  },
});

export const plaidClient = new PlaidApi(config);
