'use client';
import HampersCarousel from "@/components/customer/homeComponents/HampersCarousel";
import { HAMPERS } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const CustomerHomePage = () => {
  // console.log("Data Fetched from customer home page");
  // console.log(JSON.parse(userData!));

  const [dataHampers, setDataHampers] = useState<HAMPERS[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataHampers = async () => {
    setIsLoading(true);
    const resDataHampers = await fetch(`/api/hampers`);

    const resFinal = await resDataHampers.json();

    console.log(resFinal.dataHampers);

    // resDataHampers.data.dataHampers.forEach((element: any) => {
    //     console.log(element);
    // })

    setDataHampers(resFinal.dataHampers);

    console.log(dataHampers);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataHampers();
  },[]);

  return (
    <div>
      <div className="mx-40">
        <h1 className="text-xl mb-2 font-poetsen">Paket Hampers</h1>
        {isLoading ? <ClipLoader/> : 
        <HampersCarousel dataHampers={dataHampers}/>
        }
      </div>
    </div>
  );
};

export default CustomerHomePage;
