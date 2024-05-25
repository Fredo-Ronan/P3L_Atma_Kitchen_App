"use client";
import { getItemsFromKeranjang, getItemsHampersFromKeranjang } from "@/actions/getItemFromKeranjang.actions";
import ReadyProdukPage from "@/components/customer/produkComponents/ReadyProdukPage";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUK } from "@/types";
import { getDatesAfterTodayToN } from "@/utilities/dateParser";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProdukReadyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataProdukReady, setDataProdukReady] = useState<PRODUK[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [tanggalPengiriman, setTanggalPengiriman] = useState<string>("");
  const [dates, setDates] = useState<string[]>([]);
  const skeletonArray = new Array(7).fill(null);

  const fetchDataProdukReady = async () => {
    setIsLoading(true);
    const resDataProdukReady = await fetch(`/api/produk/getAllReadyStock`);

    const resFinalDataProdukReady = await resDataProdukReady.json();

    setDataProdukReady(resFinalDataProdukReady.produkReadyStock);
    setIsLoading(false);
  };

  const getItemsKeranjang = async () => {
    const keranjang = await getItemsFromKeranjang();
    const keranjangHampers = await getItemsHampersFromKeranjang();

    if(keranjang.length !== 0 || keranjangHampers.length !== 0){
        // console.log(keranjang);
        // console.log(keranjangHampers);
        setSelectedDate(keranjang.at(0)?.TANGGAL_PENGIRIMAN! || keranjangHampers.at(0)?.TANGGAL_PENGIRIMAN!);
        setTanggalPengiriman(keranjang.at(0)?.TANGGAL_PENGIRIMAN! || keranjangHampers.at(0)?.TANGGAL_PENGIRIMAN!);
    }
  }

  const getDates = async () => {
      setIsLoading(true);
      try {
        const resLastTanggal = await axios.get(`/api/getLastTanggalKuota`);
  
        const finalLastTanggalKuota = resLastTanggal.data.lastTanggal[0].LAST_TANGGAL.split("T")[0];
  
        const datesAfterTodayToN = getDatesAfterTodayToN(new Date(finalLastTanggalKuota));
  
        setDates(datesAfterTodayToN);
      }catch(error){
        console.log(error);
        throw error;
      }
    }

  useEffect(() => {
    getDates();
    getItemsKeranjang();
    fetchDataProdukReady();
  }, []);

  return (
    <div className="font-poetsen px-16">
      <h1 className="text-2xl font-bold mt-4 mb-7">Ready Stock</h1>
      {tanggalPengiriman === "" ?
          <div className='my-4'>
              <Select
                  onValueChange={(content) => setSelectedDate(content)}
                  defaultValue={selectedDate}
              >
                  <SelectTrigger className="w-[180px] h-[46px]">
                  <SelectValue placeholder="Select a date" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="today" disabled>Select Date</SelectItem>
                  {dates.map((item) => (
                      <SelectItem key={item} value={item}>
                      {item}
                      </SelectItem>
                  ))}
                  </SelectContent>
              </Select>
          </div> : <div className="mb-4">
              <div className="font-poetsen italic">Tanggal Pengiriman : {tanggalPengiriman}</div>
              <div className="font-poetsen italic text-red-500">Anda sudah tidak bisa mengubah tanggal pengiriman jika sudah ada produk di dalam keranjang, silahkan kosongkan keranjang anda terlebih dahulu</div> 
          </div>
      }
      {isLoading ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {skeletonArray.map((_, index) => (
            <div className="w-72" key={index}>
              <Card>
                <CardContent className="py-6">
                  <div className="flex justify-center">
                    <div className="relative w-full h-52">
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="my-2 w-3/4 h-8" />
                    <Skeleton className="w-1/2 h-6" />
                  </div>
                  <div className="mt-6">
                    <Skeleton className="w-1/2 h-6" />
                    <Skeleton className="w-1/3 h-6 mt-2" />
                  </div>
                  <div className="mt-4">
                    <Skeleton className="w-full h-10" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <ReadyProdukPage dataProdukReady={dataProdukReady} selectedDate={selectedDate}/>
      )}
    </div>
  );
};

export default ProdukReadyPage;
