import SaldoView from "@/components/SaldoView";
import { cookies } from "next/headers";
import React from "react";

const Page = () => {
  const user = cookies().get("user_data");
  const userData = user?.value;

  if (!userData) return null;

  const { id_customer } = JSON.parse(userData);
  return (
    <div className="flex min-h-[60vh] py-20 px-5 flex-col">
      <h1 className="text-xl font-bold">
        SALDO <span className="text-blue-600">CUSTOMER</span>
      </h1>
      <SaldoView data={id_customer} />
    </div>
  );
};

export default Page;
