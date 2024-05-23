import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { KUOTA_HARIAN, PRODUK_FOR_CUSTOMER_UI } from '@/types'
import { Button } from '@/components/ui/button'
import DetilProdukPage from '../produkComponents/DetilProdukPage'

interface DATA_KUOTA {
    nama_produk: string;
    kuotaProduk: KUOTA_HARIAN[];
}

const ProdukPreorderCarousel = ({ dataProdukPreorder }: { dataProdukPreorder: PRODUK_FOR_CUSTOMER_UI[] }) => {

  return (
    <div>
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {dataProdukPreorder?.map((data, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4">
                        <div className="p-1">
                            <Card>
                                <CardContent className="py-6">
                                    <div className="flex justify-center">
                                        <div className="relative w-full h-52">
                                            <img src={data.GAMBAR_PRODUK} className="absolute inset-0 w-full h-full object-cover" alt="" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='my-2 font-poetsen font-bold text-2xl'>{data.NAMA_PRODUK}</h1>
                                        {data.HARGA_PRODUK.map((harga, indexHarga) => (
                                            <div className='flex' key={harga + 1}>
                                                <p key={harga + 2} className='font-poetsen text-lg'>Rp. {harga.toLocaleString('id-ID')}</p>
                                                {
                                                    data.JENIS_MAKANAN === "Cake" ?
                                                    <p key={harga + 3} className='mx-2 font-poetsen opacity-50 text-lg'>{"/ " + data.LOYANG[indexHarga]}</p>
                                                    : <></>
                                                }
                                            </div>
                                        ))}
                                    </div>

                                    {/* <Button className='bg-blue-500 mt-4'>Lihat Produk</Button> */}
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
  )
}

export default ProdukPreorderCarousel