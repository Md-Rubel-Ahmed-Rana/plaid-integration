import { apiSlice } from "@/redux";

const plaidApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLinkToken: build.query({
      query: () => ({
        url: `/plaid/link-token`,
      }),
      providesTags: ["payout-accounts"],
    }),
    exchangePublicToken: build.mutation({
      query: (data: {
        public_token: string;
        userId: string;
        institution: { institution_id: string; institution_name: string };
      }) => ({
        url: `/plaid/exchange-public-token`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payout-accounts"],
    }),
  }),
});

export const { useGetLinkTokenQuery, useExchangePublicTokenMutation } =
  plaidApi;
