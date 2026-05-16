import { apiSlice } from "@/redux";

const plaidApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLinkToken: build.query({
      query: ({ email }: { email: string }) => ({
        url: `/api/v1/plaid/${email}/link-token`,
      }),
      providesTags: ["payout-accounts"],
    }),
    exchangePublicToken: build.mutation({
      query: (data: {
        public_token: string;
        email: string;
        institution: { institution_id: string; institution_name: string };
      }) => ({
        url: `/api/v1/plaid/exchange-public-token`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payout-accounts"],
    }),
  }),
});

export const { useGetLinkTokenQuery, useExchangePublicTokenMutation } =
  plaidApi;
