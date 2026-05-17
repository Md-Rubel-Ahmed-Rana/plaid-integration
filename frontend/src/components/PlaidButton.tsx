import { usePlaidLink } from "react-plaid-link";
import { toast } from "react-toastify";
import {
  useExchangePublicTokenMutation,
  useGetLinkTokenQuery,
} from "@/features/plaid";
import { useState } from "react";

type Props = {
  userEmail: string;
  buttonText?: string;
};

const PlaidButton = ({
  userEmail,
  buttonText = "Connect Bank Account",
}: Props) => {
  const {
    data,
    isLoading: isLinkTokenLoading,
    isFetching,
  } = useGetLinkTokenQuery(
    { email: userEmail },
    {
      skip: !userEmail,
    },
  );

  const link_token = data?.data?.link_token as string;
  const [loadingUI, setLoadingUI] = useState(true);

  const [exchangePublicToken, { isLoading: isConnecting }] =
    useExchangePublicTokenMutation();

  const { open, ready, exit } = usePlaidLink({
    token: link_token || "",

    onSuccess: async (public_token: string, metadata) => {
      try {
        const result = await exchangePublicToken({
          public_token,
          email: userEmail,
          institution: {
            institution_id: metadata.institution?.institution_id as string,
            institution_name: metadata.institution?.name as string,
          },
        }).unwrap();

        toast.success(result?.message || "Bank account connected successfully");
      } catch (error: any) {
        toast.error(
          error?.data?.error?.message ||
            error?.data?.message ||
            error?.message ||
            "Failed to connect account",
        );
      }
    },

    onExit: (error) => {
      console.log({ onExitError: error });
    },
    onLoad: () => {
      setLoadingUI(false);
    },
  });

  console.log({ open, ready, exit, loadingUI });

  const isPreparingPlaid =
    isLinkTokenLoading || isFetching || !link_token || !ready || loadingUI;

  return (
    <button
      onClick={() => open()}
      disabled={isPreparingPlaid || isConnecting}
      className="cursor-pointer bg-blue-700 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition"
    >
      {isPreparingPlaid
        ? "Preparing secure connection..."
        : isConnecting
          ? "Connecting..."
          : buttonText}
    </button>
  );
};

export default PlaidButton;
