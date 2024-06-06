'use client';
import FilterMO from '@/components/mo/FilterMo';
import { bulanFilter } from '@/constants/mapping';
import { LAPORAN_PENJUALAN_PER_PRODUK, QueryParams } from '@/types'
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
import { laporanPenjualanProdukPDFMaker } from '@/utilities/laporan/laporanPenjualanProdukPDF';
import Link from 'next/link';
  

const LaporanPenjualanPerProduk = ({ searchParams }: { searchParams: QueryParams }) => {

    const [dataLaporan, setDataLaporan] = useState<LAPORAN_PENJUALAN_PER_PRODUK[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const queryParams: QueryParams = {
        q: searchParams.q,
        orderBy: searchParams.orderBy,
        page: searchParams.page,
        filter: searchParams.filter,
      };

      const countTotal = (data: LAPORAN_PENJUALAN_PER_PRODUK[]) => {
        let count = 0;

        data.forEach((dataLaporan) => {
            count += dataLaporan.JUMLAH_UANG;
        });

        setTotal(count);
      }

      const fetchLaporan = async () => {
        setIsLoading(true);
        const res = await axios.get(`/api/laporan/penjualanBulananPerProduk/1`, { params: queryParams });

        if(res.data.data === null){
            setIsLoading(false);
            return;
        }

        setDataLaporan(res.data.data);
        countTotal(res.data.data);

        setIsLoading(false);
      }

      useEffect(() => {
        fetchLaporan();
      }, [searchParams])

  return (
    <div>
        <Link href={"/ownerView/laporan"}>
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
                {dataLaporan.length === 0 ?
                    <div className='flex justify-center items-center text-lg italic text-red-500'>
                        Kosong
                    </div>
                    : <div className='mt-6'>
                        <div className='mb-6 flex justify-between items-end'>
                            <div>
                                <h1 className='mt-6 font-bold text-lg underline'>LAPORAN PENJUALAN BULANAN</h1>
                                <p>Bulan : {queryParams.filter}</p>
                                <p>Tahun : 2024</p>
                                <p>Tanggal Cetak : {new Date().toLocaleDateString()}</p>
                            </div>

                            <Button className='bg-blue-500' onClick={() => {laporanPenjualanProdukPDFMaker(dataLaporan, queryParams.filter !== undefined ? queryParams.filter : "", total)}}>Cetak</Button>
                        </div>

                        <Table>
                            <TableCaption>Laporan Penjualan Bulanan</TableCaption>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Kuantitas</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Jumlah Uang</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {dataLaporan.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.NAMA_PRODUK}</TableCell>
                                    <TableCell>{data.JUMLAH_TERJUAL}</TableCell>
                                    <TableCell>Rp. {data.HARGA_PRODUK.toLocaleString("id-ID")}</TableCell>
                                    <TableCell>Rp. {data.JUMLAH_UANG.toLocaleString("id-ID")}</TableCell>
                                </TableRow>
                            ))}

                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className='text-right font-bold'>Total</TableCell>
                                    <TableCell>Rp. {total.toLocaleString("id-ID")}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                  
                }
            </div>
        }
    </div>
  )
}

export default LaporanPenjualanPerProduk