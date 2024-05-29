import React from "react";
import { cookies } from "next/headers";
import CardView from "@/components/pesanan/CardView";

const PesananPage = () => {
  const userData = cookies().get("user_data");
  const value = userData?.value;

  if (!value) return null;

  const { id_customer } = JSON.parse(value);

  return (
    <div className="max-w-screen-xl mx-auto py-20 min-h-screen">
      <h2 className="text-4xl font-bold">Daftar Pesanan </h2>
      <p className="text-gray-600 text-sm mt-2">
        Berikut pesanan yang perlu dibayar
      </p>
      <CardView data={id_customer} />
    </div>
  );
};

export default PesananPage;
