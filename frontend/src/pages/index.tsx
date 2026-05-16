import Accounts from "@/accounts";
import Login from "@/components/Login";
import PlaidButton from "@/components/PlaidButton";
import { useGetAccountsQuery } from "@/features/accounts";

import { IParentAccount } from "@/types/account.type";
import { localStorageManager } from "@/utils/localStorage";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const { data, isLoading } = useGetAccountsQuery({ userEmail: user?.email });
  const accounts = data?.data as IParentAccount[];

  useEffect(() => {
    const storedUser = localStorageManager.get("user");
    setUser(storedUser);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {!user?.id ? (
        <Login />
      ) : accounts?.length <= 0 ? (
        <PlaidButton userEmail={user?.email} />
      ) : (
        <Accounts accounts={accounts} userEmail={user?.email} />
      )}
    </div>
  );
};

export default HomePage;
