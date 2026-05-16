import { apiSlice } from "@/redux";

const accountApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query({
      query: ({ userEmail }: { userEmail: string }) => ({
        url: `/payout-accounts/${userEmail}`,
      }),
      providesTags: ["payout-accounts"],
    }),
  }),
});

export const { useGetAccountsQuery } = accountApi;
