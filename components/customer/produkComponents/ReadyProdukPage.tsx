import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PRODUK } from '@/types'
import React from 'react'

const ReadyProdukPage = ({ dataProdukReady }: { dataProdukReady: PRODUK[] }) => {
  return (
    <div className='flex flex-wrap gap-6 justify-center'>
        {dataProdukReady?.map((data, index) => (
            <div className="w-72" key={index}>
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
                        <div className='mt-4'>
                            <Button className='bg-blue-500'>Beli Sekarang</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ))}
    </div>
  )
}

export default ReadyProdukPage