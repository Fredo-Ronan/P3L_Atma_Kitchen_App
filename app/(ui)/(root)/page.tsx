'use client';
import HampersCarousel from "@/components/customer/homeComponents/HampersCarousel";
import ProdukPreorderCarousel from "@/components/customer/homeComponents/ProdukPreorderCarousel";
import ProdukReadyCarousel from "@/components/customer/homeComponents/ProdukReadyCarousel";
import { HAMPERS, PRODUK, PRODUK_FOR_CUSTOMER_UI } from "@/types";
import { mergeDuplicates } from "@/utilities/mergeProdukPreorder";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const CustomerHomePage = () => {
  // console.log("Data Fetched from customer home page");
  // console.log(JSON.parse(userData!));

  const [dataHampers, setDataHampers] = useState<HAMPERS[]>([]);
  const [dataProdukPreorder, setDataProdukPreorder] = useState<PRODUK_FOR_CUSTOMER_UI[]>([]);
  const [dataProdukReady, setDataProdukReady] = useState<PRODUK[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataHampers = async () => {
    setIsLoading(true);
    const resDataHampers = await fetch(`/api/hampers`);

    const resFinal = await resDataHampers.json();

    // console.log(resFinal.dataHampers);

    // resDataHampers.data.dataHampers.forEach((element: any) => {
    //     console.log(element);
    // })

    setDataHampers(resFinal.dataHampers);

    // console.log(dataHampers);
  }

  const fetchDataProdukPreorder = async () => {
    const resDataProdukPreorder = await fetch(`/api/produk/getPreOrder`);


    const resFinalProdukPreorder = await resDataProdukPreorder.json();

    // console.log(resFinalProdukPreorder.dataProdukPreorder);

    const merged = mergeDuplicates(resFinalProdukPreorder.dataProdukPreorder);
    // console.log(merged);

    setDataProdukPreorder(merged);
  }

  const fetchDataProdukReadyStock = async () => {
    const resDataProdukReadyStock = await fetch(`/api/produk/getReadyStock`);

    const resFinalProdukReadyStock = await resDataProdukReadyStock.json();

    // console.log(resFinalProdukReadyStock.produkReadyStock);

    setDataProdukReady(resFinalProdukReadyStock.produkReadyStock);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataHampers();
    fetchDataProdukPreorder();
    fetchDataProdukReadyStock();
  },[]);

  return (
    <div>
      <div className="mx-40">
        {isLoading ? 
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={60}/>
          </div>
        : 
        <div className="font-poetsen">
          <h1 className="text-xl mb-2 font-poetsen">Paket Hampers</h1>
          <HampersCarousel dataHampers={dataHampers}/>
          <div className="h-20"></div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl mb-2 font-poetsen">Pre Order |</h1>
            <a href="/produkPreOrder" className="text-xl mb-2 font-bold relative before:absolute before:inset-0 before:transition-all before:duration-300 duration-300 transition-all before:w-0 hover:before:w-full hover:text-white before:-z-10 hover:before:bg-blue-500">Lihat Semua</a>
          </div>
          <ProdukPreorderCarousel dataProdukPreorder={dataProdukPreorder}/>
          <div className="h-20"></div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl mb-2 font-poetsen">Ready Stock</h1>
            <a href="" className="text-xl mb-2 font-bold relative before:absolute before:inset-0 before:transition-all before:duration-300 duration-300 transition-all before:w-0 hover:before:w-full hover:text-white before:-z-10 hover:before:bg-blue-500">Lihat Semua</a>
          </div>
          <ProdukReadyCarousel dataProdukReady={dataProdukReady}/>
        </div>
        }
      </div>
    </div>
  );
};

export default CustomerHomePage;
