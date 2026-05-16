import { IChildAccount } from "@/types/account.type";
import AccountItem from "./AccountItem";

type Props = {
  accounts: IChildAccount[];
};

const AccountList = ({ accounts }: Props) => {
  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <AccountItem key={account.id} account={account} />
      ))}
    </div>
  );
};

export default AccountList;
