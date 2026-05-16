import Accounts from "@/accounts";
import ServerWakingUp from "@/common/ServerWakingUp";
import Login from "@/components/Login";
import PlaidButton from "@/components/PlaidButton";
import { useGetAccountsQuery } from "@/features/accounts";
import { useStartServerQuery } from "@/features/common";
import PageMetadata from "@/seo/PageMetadata";

import { IParentAccount } from "@/types/account.type";
import { localStorageManager } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const { data, isLoading } = useGetAccountsQuery({ userEmail: user?.email });
  const { isLoading: isServerStaring } = useStartServerQuery({});
  const accounts = data?.data as IParentAccount[];

  useEffect(() => {
    const storedUser = localStorageManager.get("user");
    setUser(storedUser);
  }, []);

  if (isServerStaring) {
    return <ServerWakingUp />;
  }

  return (
    <>
      <PageMetadata />
      <div className="flex justify-center items-center h-screen">
        {!user?.id ? (
          <Login />
        ) : isLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="flex items-center justify-center gap-3 text-blue-600 font-medium">
              <FiLoader className="animate-spin text-xl" />
              <span> Accounts are loading...</span>
            </div>
          </div>
        ) : accounts?.length <= 0 ? (
          <PlaidButton userEmail={user?.email} />
        ) : (
          <Accounts accounts={accounts} userEmail={user?.email} />
        )}
      </div>
    </>
  );
};

export default HomePage;
