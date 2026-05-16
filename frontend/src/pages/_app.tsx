import { store } from "@/redux";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, Suspense } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Suspense
      fallback={
        <div className="min-h-dvh">
          <h1>App is loading...</h1>
        </div>
      }
    >
      <Provider store={store}>
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer />
      </Provider>
    </Suspense>
  );
}
