import { usePlaidLink } from "react-plaid-link";
import { toast } from "react-toastify";
import {
  useExchangePublicTokenMutation,
  useGetLinkTokenQuery,
} from "@/features/plaid";

type Props = {
  userEmail: string;
  buttonText?: string;
};

const PlaidButton = ({
  userEmail,
  buttonText = "Connect Bank Account",
}: Props) => {
  const { data } = useGetLinkTokenQuery({ email: userEmail });
  const link_token = data?.data?.link_token as string;
  const [exchangePublicToken, { isLoading }] = useExchangePublicTokenMutation();

  const { open, ready } = usePlaidLink({
    token: link_token || "",

    onSuccess: async (public_token: string, metadata) => {
      // We also need to verify sub account is exist or not
      console.log({ metadata });
      try {
        const result = await exchangePublicToken({
          public_token: public_token,
          email: userEmail,
          institution: {
            institution_id: metadata.institution?.institution_id as string,
            institution_name: metadata.institution?.name as string,
          },
        }).unwrap();
        console.log({ result });
        if (result?.statusCode === 200) {
          toast.success(result?.message || "Bank account verified!");
        }
      } catch (error: any) {
        console.log({ error });
        toast.error(
          error?.data?.error?.message ||
            error?.data?.message ||
            error?.message ||
            "Failed to connect account",
        );
      }
    },
    onExit: (error) => {
      console.log({ OnError: error });
    },
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready || isLoading}
      className="cursor-pointer bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
    >
      {isLoading ? "Connecting..." : buttonText}
    </button>
  );
};

export default PlaidButton;
