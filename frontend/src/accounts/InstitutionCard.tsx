import { IParentAccount } from "@/types/account.type";
import { FaUniversity } from "react-icons/fa";
import AccountList from "./AccountList";

type Props = {
  account: IParentAccount;
};

const InstitutionCard = ({ account }: Props) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FaUniversity className="text-gray-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {account.institution_name}
            </h2>
            <p className="text-xs text-gray-500">
              Connected • {new Date(account.createdAt).toDateString()}
            </p>
          </div>
        </div>

        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      <AccountList accounts={account.accounts || []} />
    </div>
  );
};

export default InstitutionCard;
