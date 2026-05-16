import { apiSlice } from "@/redux";

const accountApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query({
      query: ({ userId }: { userId: string }) => ({
        url: `/payout-accounts/${userId}`,
      }),
      providesTags: ["payout-accounts"],
    }),
  }),
});

export const { useGetAccountsQuery } = accountApi;
