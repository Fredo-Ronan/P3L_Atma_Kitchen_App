import React from "react";
import { cookies } from "next/headers";
import CardView from "@/components/pesanan/CardView";
import KonfirmasiPesanan from "@/components/pesanan/KonfirmasiPesanan";

const PesananPage = () => {
  const userData = cookies().get("user_data");
  const value = userData?.value;

  if (!value) return null;

  const dataCustomer = JSON.parse(value);

  return (
    <div className="max-w-screen-xl mx-auto py-20 min-h-screen">
      <h2 className="text-4xl font-bold">Daftar Pesanan </h2>
      <p className="text-gray-600 text-sm mt-2">
        Berikut pesanan yang perlu dibayar
      </p>
      <CardView data={dataCustomer} />
      <h2 className="text-2xl font-bold mt-8">Pesanan Anda Sudah Diterima?</h2>
      <KonfirmasiPesanan data={dataCustomer}/>
    </div>
  );
};

export default PesananPage;
