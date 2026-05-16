import { apiSlice } from "@/redux";

const accountApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query({
      query: ({ userEmail }: { userEmail: string }) => ({
        url: `/api/v1/payout-accounts/${userEmail}/accounts`,
      }),
      providesTags: ["payout-accounts"],
    }),
  }),
});

export const { useGetAccountsQuery } = accountApi;
