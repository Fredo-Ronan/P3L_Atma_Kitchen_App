'use client';
import TabelPesananHarusDiproses from '@/components/mo/TabelPesananHarusDiproses';
import { BAHAN_BAKU, TRANSAKSI_PESANAN } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

const PesananHarusDiProsesPage = () => {

    const [dataPesananHarusDiproses, setDataPesananHarusDiproses] = useState<TRANSAKSI_PESANAN[]>([]);
    const [dataBahan, setDataBahan] = useState<BAHAN_BAKU[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPesananHarusDiprosesHariIni = async () => {
        setIsLoading(true);
        try {
            const resPesananHarusDiprosesHariIni = await axios.get(`/api/getPesananDiprosesToday/1`);

            setDataPesananHarusDiproses(resPesananHarusDiprosesHariIni.data.dataPesanan);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    const getBahan = async () => {
        try {
            const resBahan = await axios.get(`/api/getAllBahan`);

            setDataBahan(resBahan.data.dataBahan);
        }catch(error){
            console.log(error);
            throw error;
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getPesananHarusDiprosesHariIni();
        getBahan();
    }, [])

  return (
    <div>
        {isLoading ?
        <div className='flex justify-center items-center'>
            <ClipLoader/>
        </div>
            :
            <div>
                <TabelPesananHarusDiproses dataPesanan={dataPesananHarusDiproses} dataBahan={dataBahan}/>
            </div>
        }
    </div>
  )
}

export default PesananHarusDiProsesPage