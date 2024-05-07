'use client';
import CreateEditHampers from '@/components/admin/CreateEditHampers';
import LocalSearchBar from '@/components/admin/LocalSearchBar';
import Pagination from '@/components/admin/Pagination';
import TableHampers from '@/components/admin/TabelHampers';
import { HAMPERS, PRODUK, QueryParams } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';

const HampersAdminPage = ({ searchParams }: { searchParams: QueryParams }) => {

  const router = useRouter();

  const [allDataProduk, setAllDataProduk] = useState<PRODUK[]>([]);
  const [dataHampers, setDataHampers] = useState<HAMPERS[]>([]);

  const [isLoading, setIsLoading ] = useState(false);


  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchDataProduk = async () => {
    setIsLoading(true);
    const resultAllProduk = await axios.get(`/api/getAllProduk`);

    setAllDataProduk(resultAllProduk.data.allDataProduk);
  }

  const fetchDataHampers = async () => {
    const resultGetHampers = await axios.get(`/api/hampers`, { params: queryParams });

    setDataHampers(resultGetHampers.data.dataHampers);
    setIsLoading(false);
  }

  const refreshData = async () => {
    await fetchDataProduk();
    await fetchDataHampers();
    router.refresh();
  }


  const deleteHampers = async (id: number) => {
    try {
      const resultDeleteHampers = await axios.delete(`/api/hampers/${id}`);

      refreshData();
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDataProduk();
    fetchDataHampers();
  }, [searchParams]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Hampers</h1>
      <div className='flex justify-between items-center'>
          <div className='flex mb-6'>
              <LocalSearchBar />
              <div className='w-9'></div>
              {/* <Filter filter={filterProduk}/> */}
          </div>
          {/* create */}
          <CreateEditHampers dataProduk={allDataProduk} refreshData={refreshData}/>
      </div>
      {isLoading ?
            <div className="flex justify-center flex-1 my-10">
            <SyncLoader color="#2563eb" />
          </div> :
            <TableHampers data={dataHampers} deleteData={deleteHampers} refreshData={refreshData}/>
      }
    </div>
  )
}

export default HampersAdminPage