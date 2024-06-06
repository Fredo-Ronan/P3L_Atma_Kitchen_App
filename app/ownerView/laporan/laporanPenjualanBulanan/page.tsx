'use client';
import ChartPenjualan from "@/components/mo/ChartPenjualan";
import { PENJUALAN_BULANAN } from "@/types";
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
import { laporanPenjualanKeseluruhanPDFMaker } from "@/utilities/laporan/laporanPenjualanKeseluruhan";

const LaporanPenjualanBulananKeseluruhan = () => {
    const [dataLaporan, setDataLaporan] = useState<PENJUALAN_BULANAN[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLaporan = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/penjualanBulanan`);

            if (res.data.data === null) {
                setIsLoading(false);
                return;
            }

            setDataLaporan(res.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLaporan();
    }, []);

    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return (
        <div>
            <Link href={"/moView/laporan"}>
                <Button>Back</Button>
            </Link>
            <div className='mb-6'></div>
            <h1 className="text-2xl font-bold mb-10">Chart Penjualan</h1>
            <ChartPenjualan />
            {isLoading ?
                <div className='flex justify-center items-center'>
                    <ClipLoader />
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
                                    <h1 className='mt-6 font-bold text-lg underline'>LAPORAN PENJUALAN BULANAN KESELURUHAN</h1>
                                    <p>Tahun : 2024</p>
                                    <p>Tanggal Cetak : {new Date().toLocaleDateString()}</p>
                                </div>

                                <Button className='bg-blue-500' onClick={() => { laporanPenjualanKeseluruhanPDFMaker(dataLaporan) }}>Cetak</Button>
                            </div>

                            <Table>
                                <TableCaption>Laporan Penjualan Bulanan Keseluruhan</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bulan</TableHead>
                                        <TableHead>Total Transaksi</TableHead>
                                        <TableHead>Jumlah Uang</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {months.map((month, index) => {
                                        const data = dataLaporan.find(data => data.BULAN === index + 1);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{month}</TableCell>
                                                <TableCell>{data ? data.TOTAL_TRANSAKSI : 0}</TableCell>
                                                <TableCell>Rp. {data ? data.TOTAL_HARGA : 0}</TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell className='text-right font-bold'>Total</TableCell>
                                        <TableCell>Rp.{dataLaporan[0].TOTAL_HARGA_TAHUNAN}</TableCell>
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

export default LaporanPenjualanBulananKeseluruhan
