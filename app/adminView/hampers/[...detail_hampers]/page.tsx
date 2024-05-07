'use client';
import CreateEditHampers from '@/components/admin/CreateEditHampers';
import TableDetilHampers from '@/components/admin/TabelDetilHampers';
import { HAMPERS, PRODUK } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SyncLoader } from 'react-spinners';

const DetailHampersAdminPage = ({ params }: { params: { detail_hampers: string[] } }) => {

  const router = useRouter();
  const id_hampers = params.detail_hampers[1];
  const nama_hampers = params.detail_hampers[0].replace('%20', ' ');
  const [isLoading, setIsLoading] = useState(false);
  const [dataDetilHampers, setDataDetilHampers] = useState<PRODUK[]>([]);
  const [dataHampers, setDataHampers] = useState<HAMPERS>();
  const [dataAllProduk, setDataAllProduk] = useState<PRODUK[]>([]);

  const fetchDataAllProduk = async () => {
    setIsLoading(true);
    const resAllProduk = await axios.get(`/api/getAllProduk`);

    setDataAllProduk(resAllProduk.data.allDataProduk);
  }

  const fetchDataDetilHampers = async () => {
    const resDetilHampers = await axios.get(`/api/hampers/${id_hampers}`);

    setDataDetilHampers(resDetilHampers.data.detilHampers);
    setDataHampers(resDetilHampers.data.hampers[0]);
    setIsLoading(false);
  }

  const refreshDataDetilHampers = () => {
    fetchDataAllProduk();
    fetchDataDetilHampers();
    router.refresh();
  }

  useEffect(() => {
    fetchDataAllProduk();
    fetchDataDetilHampers();
  }, [])

  return (
    <div>
        <h1 className="text-2xl font-bold">Detail Hampers "{nama_hampers}"</h1>
        <div className='mt-2 mb-4'>
          <p className='text-lg opacity-70 italic'>Keterangan : </p>
          <p className='text-lg'>Exclusive box and Card : {dataHampers?.DESKRIPSI_HAMPERS.includes('+ Exclusive box and Card') ? "Ya (+ Rp. 50.000)" : "Tidak"}</p>
          <p className='font-bold text-xl mt-2'>Total Harga : Rp. {dataHampers?.HARGA_HAMPERS}</p>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex mb-6'>
              <div className='w-9'></div>
              {/* <Filter filter={filterProduk}/> */}
          </div>
          {/* create */}
          <CreateEditHampers data={dataHampers} produkSudahTerpilih={dataDetilHampers} dataProduk={dataAllProduk} refreshData={refreshDataDetilHampers}/>
      </div>
      {
        isLoading ? <div className='flex justify-center'>
          <SyncLoader color='#2563eb'/>
        </div>
        :
        <div className='mt-4'>
          <TableDetilHampers data={dataDetilHampers}/>
        </div>
      }
    </div>
  )
}

export default DetailHampersAdminPage