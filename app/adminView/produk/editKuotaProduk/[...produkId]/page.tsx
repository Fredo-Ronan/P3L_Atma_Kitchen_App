'use client';
import TabelKuotaHarian from '@/components/admin/TabelKuotaHarian';
import { KUOTA_HARIAN } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SyncLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';

const EditKuotaProdukPage = ({ params }: { params: { produkId: string[] } }) => {

  const router = useRouter();
  const idProduk = params.produkId[1];
  const namaProduk = params.produkId[0].replace("%20", " ");

  const [dataKuotaProduk, setDataKuotaProduk] = useState<KUOTA_HARIAN[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    const resultGetKuotaProduk = await axios.get(`/api/getKuotaHarian/${idProduk}`);

    setDataKuotaProduk(resultGetKuotaProduk.data.data);
    setIsLoading(false);
  }

  const refreshData = async () => {
    fetchData();
    router.refresh();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kuota Produksi Produk {namaProduk}</h1>
      {
        isLoading ? 
        <div className='flex justify-center'>
          <SyncLoader/>
        </div>
        :
        <TabelKuotaHarian data={dataKuotaProduk} refreshData={refreshData}/>
      }
    </div>
  )
}

export default EditKuotaProdukPage