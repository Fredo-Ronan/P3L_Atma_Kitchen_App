'use client';
import HampersCarousel from "@/components/customer/homeComponents/HampersCarousel";
import ProdukPreorderCarousel from "@/components/customer/homeComponents/ProdukPreorderCarousel";
import { HAMPERS, PRODUK, PRODUK_FOR_CUSTOMER_UI } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const CustomerHomePage = () => {
  // console.log("Data Fetched from customer home page");
  // console.log(JSON.parse(userData!));

  const [dataHampers, setDataHampers] = useState<HAMPERS[]>([]);
  const [dataProdukPreorder, setDataProdukPreorder] = useState<PRODUK_FOR_CUSTOMER_UI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to merge duplicates based on NAMA_PRODUK
  const mergeDuplicates = (products: PRODUK[]): PRODUK_FOR_CUSTOMER_UI[] => {
    const productMap: { [key: string]: PRODUK_FOR_CUSTOMER_UI } = {};

    products.forEach((product) => {
      if (!productMap[product.NAMA_PRODUK]) {
        // If the product does not exist in the map, add it
        productMap[product.NAMA_PRODUK] = {
          ...product,
          LOYANG: [product.LOYANG],
          HARGA_PRODUK: [product.HARGA_PRODUK]
        };
      } else {
        // If it exists, merge the LOYANG and HARGA_PRODUK attributes
        productMap[product.NAMA_PRODUK].LOYANG.push(product.LOYANG);
        productMap[product.NAMA_PRODUK].HARGA_PRODUK.push(product.HARGA_PRODUK);
      }
    });

    // Convert the map back to an array
    return Object.values(productMap);
  };

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

    setDataProdukPreorder(merged)
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataHampers();
    fetchDataProdukPreorder();
  },[]);

  return (
    <div>
      <div className="mx-40">
        {isLoading ? 
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={60}/>
          </div>
        : 
        <div>
          <h1 className="text-xl mb-2 font-poetsen">Paket Hampers</h1>
          <HampersCarousel dataHampers={dataHampers}/>
          <div className="h-20"></div>
          <h1 className="text-xl mb-2 font-poetsen">Pre Order</h1>
          <ProdukPreorderCarousel dataProdukPreorder={dataProdukPreorder}/>
        </div>
        }
      </div>
    </div>
  );
};

export default CustomerHomePage;
