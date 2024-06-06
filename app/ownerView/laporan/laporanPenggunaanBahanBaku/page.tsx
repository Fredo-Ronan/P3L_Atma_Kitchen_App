'use client';
import FilterMO from '@/components/mo/FilterMo';
import { bulanFilter } from '@/constants/mapping';
import { PENGGUNAAN_BAHAN_BAKU, QueryParams } from '@/types'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { laporanPenggunaanBahanPDFMaker } from '@/utilities/laporan/laporanPenggunaanBahanBaku';
  

const laporanPenggunaanBahanBaku = ({ searchParams }: { searchParams: QueryParams }) => {

    const [penggunaanBahan, setPenggunaanBahan] = useState<PENGGUNAAN_BAHAN_BAKU[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const queryParams: QueryParams = {
        q: searchParams.q,
        orderBy: searchParams.orderBy,
        page: searchParams.page,
        filter: searchParams.filter,
      };


      const fetchPenggunaanBahan = async () => {
        setIsLoading(true);
        const res = await axios.get(`/api/laporan/penggunaanBahanBaku/1`, { params: queryParams });

        if(res.data.data === null){
            setIsLoading(false);
            return;
        }

        setPenggunaanBahan(res.data.data);
        setIsLoading(false);
      }

      useEffect(() => {
        fetchPenggunaanBahan();
      }, [searchParams])

  return (
    <div>
        <Link href={"/moView/laporan"}>
            <Button>Back</Button>
        </Link>
        <div className='mb-6'></div>
        <FilterMO filter={bulanFilter}/>
        {isLoading ?
            <div className='flex justify-center items-center'>
                <ClipLoader/>
            </div>
            :
            <div>
                {penggunaanBahan.length === 0 ?
                    <div className='flex justify-center items-center text-lg italic text-red-500'>
                        Kosong
                    </div>
                    : <div className='mt-6'>
                        <div className='mb-6 flex justify-between items-end'>
                            <div>
                                <h1 className='mt-6 font-bold text-lg underline'>LAPORAN PENGGUNAAN BAHAN BAKU</h1>
                                <p>Bulan : {queryParams.filter}</p>
                                <p>Tahun : 2024</p>
                                <p>Tanggal Cetak : {new Date().toLocaleDateString()}</p>
                            </div>

                            <Button className='bg-blue-500' onClick={() => {laporanPenggunaanBahanPDFMaker(penggunaanBahan, queryParams.filter !== undefined ? queryParams.filter : "")}}>Cetak</Button>
                        </div>

                        <Table>
                            <TableCaption>Laporan Penggunaan Bahan Baku</TableCaption>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Nama Bahan</TableHead>
                                <TableHead>Satuan</TableHead>
                                <TableHead>Digunakan</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {penggunaanBahan.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.NAMA_BAHAN}</TableCell>
                                    <TableCell>{data.SATUAN}</TableCell>
                                    <TableCell>{data.JUMLAH_DIGUNAKAN}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                  
                }
            </div>
        }
    </div>
  )
}

export default laporanPenggunaanBahanBaku