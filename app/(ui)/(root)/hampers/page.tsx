'use client';
import { getCustomerDataTrigger } from '@/actions/getCustomerData.actions';
import { getItemsFromKeranjang, getItemsHampersFromKeranjang } from '@/actions/getItemFromKeranjang.actions';
import HampersPage from '@/components/customer/hampersComponents/HampersPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HAMPERS_FOR_KERANJANG } from '@/types';
import { getDatesAfterTodayToN } from '@/utilities/dateParser';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

const HampersCustomerPage = () => {

    const [dataHampers, setDataHampers] = useState<HAMPERS_FOR_KERANJANG[]>([]);
    const [userData, setUserData] = useState<string | null>();
    const [selectedDate, setSelectedDate] = useState("");
    const [dates, setDates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tanggalPengiriman, setTanggalPengiriman] = useState<string>("");

    const fetchDataHampers = async () => {
        try {
            const resGetDataHampers = await axios.get(`/api/hampers`);

            // console.log(resGetDataHampers.data.dataHampers);
            setDataHampers(resGetDataHampers.data.dataHampers);
        }catch(error){
            console.log(error);
            throw error;
        }
        setIsLoading(false);
    }

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

      const isCustomerLoggedIn = async () => {
        const customer = await getCustomerDataTrigger();
        setUserData(customer);
      }

    useEffect(() => {
        getItemsKeranjang();
        getDates();
        isCustomerLoggedIn();
        fetchDataHampers();
    }, [])

  return (
    <div className='font-poetsen my-4 mx-20'>
        <h1 className='font-bold text-2xl'>Hampers</h1>
        {isLoading ?
            <div className='flex justify-center items-center h-screen'>
                <ClipLoader size={60}/>
            </div>
            :
            <div>
                {userData === null ?
                    <div className='my-4'>
                        <p className="text-red-500 font-bold">Anda harus login untuk dapat memesan hampers</p>
                    </div>
                    : tanggalPengiriman === "" ?
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
                    </div> : <div>
                        <div className="font-poetsen italic">Tanggal Pengiriman : {tanggalPengiriman}</div>
                        <div className="font-poetsen italic text-red-500">Anda sudah tidak bisa mengubah tanggal pengiriman jika sudah ada produk di dalam keranjang, silahkan kosongkan keranjang anda terlebih dahulu</div> 
                    </div>
                }
                <HampersPage dataHampers={dataHampers} selectedDate={selectedDate}/>
            </div>
        }
    </div>
  )
}

export default HampersCustomerPage