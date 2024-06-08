'use client';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link';
  

const LaporanPageMO = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-10">Laporan</h1>
        <div className='flex gap-6 flex-wrap justify-center'>
            <Link href={"laporan/laporanPenjualanBulanan"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan Penjualan Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan penjualan bulanan secara keseluruhan</p>
                    </CardContent>
                </Card>
            </Link>

            <Link href={"laporan/laporanPenjualanPerProduk"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan per produk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan penjualan bulanan per produk</p>
                    </CardContent>
                </Card>
            </Link>

            <Link href={"laporan/laporanStokBahanBaku"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan stok bahan baku</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan stok bahan baku saat ini</p>
                    </CardContent>
                </Card>
            </Link>

            <Link href={"laporan/laporanPenggunaanBahanBaku"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan penggunaan bahan baku</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan penggunaan bahan baku per periode tertentu</p>
                    </CardContent>
                </Card>
            </Link>

            <Link href={"laporan/laporanKaryawan"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan presensi dan gaji</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan presensi dan gaji karyawan bulanan</p>
                    </CardContent>
                </Card>
            </Link>


            <Link href={"laporan/laporanPengeluaran"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan pemasukan dan pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan pemasukan dan pengeluaran bulanan</p>
                    </CardContent>
                </Card>
            </Link>

            <Link href={"laporan/laporanPenitip"}>
                <Card className='w-96 hover:cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-300'>
                    <CardHeader>
                        <CardTitle>Laporan transaksi penitip</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='italic opacity-70'>Laporan rekap transaksi penitip</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    </div>
  )
}

export default LaporanPageMO