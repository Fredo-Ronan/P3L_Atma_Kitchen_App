'use client';
import CreateEditProduk from '@/components/admin/CreateEditProduk';
import Filter from '@/components/admin/Filter';
import LocalSearchBar from '@/components/admin/LocalSearchBar'
import Pagination from '@/components/admin/Pagination';
import TableProduk from '@/components/admin/TableProduk'
import { filterProduk, filterLoyang } from '@/constants/mapping';
import { PRODUK, QueryParams } from '@/types'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SyncLoader } from 'react-spinners';
import { useEdgeStore } from '@/lib/edgestore';

const ProdukAdminPage = ({ searchParams }: { searchParams: QueryParams }) => {
    const [dataProduk, setDataProduk] = useState<PRODUK[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalProduk, setTotalProduk] = useState(0);
    const router = useRouter();
    const { edgestore } = useEdgeStore();

    const queryParams: QueryParams = {
        q: searchParams.q,
        orderBy: searchParams.orderBy,
        page: searchParams.page,
        filter: searchParams.filter,
    };

    const fetchDataProduk = async () => {
        setIsLoading(true);
        const resultGetProduk = await axios.get(`/api/produk`, { params: queryParams });

        // if(resultGetProduk.data.data.length <= 0){
            
        // }

        setIsLoading(false);
        setDataProduk(resultGetProduk.data.data);
        setTotalProduk(resultGetProduk.data.totalData);
    }

    useEffect(() => {
        fetchDataProduk();
    }, [searchParams]);

    const refreshDataProduk = () => {
        fetchDataProduk();
        router.refresh();
    }

    const deleteDataProduk = async (id: number) => {
        try {
            const resultQueryImage = await fetch(`/api/produk/${id}`, {
                method: "GET"
            })

            const resultImageURL = await resultQueryImage.json();

            const urlToDelete = resultImageURL.data.GAMBAR_PRODUK
            
            await edgestore.publicFiles.delete({
                url: urlToDelete,
            });

            await fetch(`/api/produk/${id}`, {
                method: "DELETE",
            })

            refreshDataProduk();
        }catch(error){
            console.log(error);
        }
    }
  return (
    <div>
        <h1 className="text-2xl font-bold">Produk</h1>
        <div className='flex justify-between items-center'>
            <div className='flex mb-6'>
                <LocalSearchBar />
                <div className='w-9'></div>
                <Filter filter={filterProduk}/>
            </div>
            <CreateEditProduk refreshData={refreshDataProduk}/>
        </div>
        {isLoading ?
            <div className="flex justify-center flex-1 my-10">
            <SyncLoader color="#2563eb" />
          </div> :
            <TableProduk data={dataProduk} refreshData={refreshDataProduk} deleteData={deleteDataProduk}/>
        }
        <div className="flex items-center justify-center mt-4">
            <Pagination
            totalContent={totalProduk}
            totalPage={10}
            currentPage={Number(searchParams.page) || 1}
            />
        </div>
    </div>
  )
}

export default ProdukAdminPage