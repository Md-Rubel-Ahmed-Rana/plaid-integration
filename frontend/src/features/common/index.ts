import { apiSlice } from "@/redux";

const commonApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    startServer: build.query({
      query: () => ({
        url: "",
      }),
    }),
  }),
});

export const { useStartServerQuery } = commonApi;
