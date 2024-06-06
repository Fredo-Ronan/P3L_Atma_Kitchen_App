'use client';
import { LAPORAN_STOK_BAHAN } from '@/types';
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
import { laporanStokBahanBakuPDFMaker } from '@/utilities/laporan/laporanStokBahanBakuPDF';
import Link from 'next/link';

const LaporanStokBahanBakuPageMO = () => {

    const [dataBahan, setDataBahan] = useState<LAPORAN_STOK_BAHAN[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStokBahan = async () => {
        setIsLoading(true);
        const res = await axios.get(`/api/laporan/stokBahanBaku`);

        setDataBahan(res.data.data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchStokBahan();
    }, [])

  return (
    <div>
        {isLoading ?
            <div className='flex justify-center items-center'>
                <ClipLoader/>
            </div>
            :
            <div className='mt-6'>
                        <div className='mb-6 flex justify-between items-end'>
                            <div>
                                <Link href={"/moView/laporan"}>
                                    <Button>Back</Button>
                                </Link>
                                <h1 className='mt-6 font-bold text-lg underline'>LAPORAN STOK BAHAN BAKU</h1>
                                <p>Tanggal Cetak : {new Date().toLocaleDateString()}</p>
                            </div>

                            <Button className='bg-blue-500' onClick={() => {laporanStokBahanBakuPDFMaker(dataBahan)}}>Cetak</Button>
                        </div>

                        <Table>
                            <TableCaption>Laporan Stok Bahan Baku</TableCaption>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Nama Bahan</TableHead>
                                <TableHead>Satuan</TableHead>
                                <TableHead>Stok</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {dataBahan.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.NAMA_BAHAN}</TableCell>
                                    <TableCell>{data.SATUAN}</TableCell>
                                    <TableCell>{data.STOK_BAHAN}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>

        }
    </div>
  )
}

export default LaporanStokBahanBakuPageMO