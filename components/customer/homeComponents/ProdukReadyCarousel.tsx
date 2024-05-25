import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PRODUK } from '@/types'
import { Button } from '@/components/ui/button'

const ProdukReadyCarousel = ({ dataProdukReady }: { dataProdukReady: PRODUK[] }) => {
  return (
    <div>
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {dataProdukReady?.map((data, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4">
                        <div className="p-1">
                            <Card>
                                <CardContent className="py-6">
                                    <div className="flex justify-center">
                                        <div className="relative w-full h-52">
                                            <img src={data.GAMBAR_PRODUK} className="absolute inset-0 w-full h-full object-cover" alt="" />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <p className={data.STOK < 20 ? 'font-bold text-red-500' : 'font-bold'}>Sisa {data.STOK}</p>
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <h1 className='my-2 font-poetsen font-bold text-2xl'>{data.NAMA_PRODUK}</h1>
                                            {data.JENIS_MAKANAN === "Cake" ?
                                                <p className='italic opacity-70'>{data.LOYANG}</p>
                                                : <></>
                                            }
                                        </div>
                                        <p className='font-poetsen text-lg'>Rp. {data.HARGA_PRODUK.toLocaleString('id-ID')}</p>
                                    </div>
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

export default ProdukReadyCarousel