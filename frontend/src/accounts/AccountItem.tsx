import { IChildAccount } from "@/types/account.type";
import BalanceBadge from "./BalanceBadge";
import DefaultPayoutBadge from "./DefaultPayoutBadge";
import { FaWallet } from "react-icons/fa";

type Props = {
  account: IChildAccount;
};

const AccountItem = ({ account }: Props) => {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FaWallet className="text-blue-500" />
        </div>

        <div>
          <h3 className="font-medium text-gray-900">{account.name.slice(5)}</h3>
          <p className="text-xs text-gray-500">
            {account.subtype} • **** {account.mask}
          </p>

          <div className="flex items-center gap-2 mt-1">
            {account.is_default_payout && <DefaultPayoutBadge />}
          </div>
        </div>
      </div>

      <div className="text-right">
        <BalanceBadge balance={account.balance} />
      </div>
    </div>
  );
};

export default AccountItem;
