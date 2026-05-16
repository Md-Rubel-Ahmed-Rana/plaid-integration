import { IParentAccount } from "@/types/account.type";
import InstitutionCard from "./InstitutionCard";
import PlaidButton from "@/components/PlaidButton";

type Props = {
  accounts: IParentAccount[];
  userEmail: string;
};

const AccountsPage = ({ accounts = [], userEmail }: Props) => {
  return (
    <div className="p-6">
      <div className="">
        <div className="mb-6">
          <div className="flex justify-between gap-4 mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Payout Accounts
            </h1>
            <PlaidButton
              userEmail={userEmail}
              buttonText="Connect Another Bank Account"
            />
          </div>

          <p className="text-sm text-gray-500">
            Manage your connected bank accounts for payouts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {accounts.map((account) => (
            <InstitutionCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
