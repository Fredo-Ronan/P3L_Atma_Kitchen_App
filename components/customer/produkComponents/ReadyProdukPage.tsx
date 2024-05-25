import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PRODUK } from '@/types'
import { getDatesAfterTodayToN } from '@/utilities/dateParser'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { addToKeranjang } from '@/actions/addToKeranjang.actions'
  

const ReadyProdukPage = ({ dataProdukReady, selectedDate }: { dataProdukReady: PRODUK[], selectedDate: string }) => {

    const [jumlah, setJumlah] = useState(0);

    const addKeranjang = async (namaProduk: string) => {
        const produkToAdd = dataProdukReady.find(data => data.NAMA_PRODUK === namaProduk);

        for(let i = 0; i < jumlah; i++){
            await addToKeranjang([{
                ID_PRODUK: produkToAdd?.ID_PRODUK!,
                NAMA_PRODUK: produkToAdd?.NAMA_PRODUK!,
                DESKRIPSI_PRODUK: produkToAdd?.DESKRIPSI_PRODUK!,
                GAMBAR_PRODUK: produkToAdd?.GAMBAR_PRODUK!,
                HARGA_PRODUK: produkToAdd?.HARGA_PRODUK!,
                JENIS_MAKANAN: produkToAdd?.JENIS_MAKANAN!,
                JENIS_PRODUK: produkToAdd?.JENIS_PRODUK!,
                LOYANG: produkToAdd?.LOYANG!,
                STATUS_PRODUK: produkToAdd?.STATUS_PRODUK!,
                STOK: produkToAdd?.STOK!,
                TANGGAL_PENGIRIMAN: selectedDate
            }])
        }
        
        window.location.reload();
    }

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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='bg-blue-500' disabled={selectedDate === ""} onClick={() => setJumlah(0)}>Tambah ke Keranjang</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah {data.NAMA_PRODUK} ke keranjang?</DialogTitle>
                                    <DialogDescription>
                                        <div className='space-y-4'>
                                            <p className='italic opacity-70'>Isikan berapa banyak {data.NAMA_PRODUK} yang ingin anda pesan?</p>
                                            <div className='flex w-fit'>
                                                <Button className='bg-red-500' disabled={jumlah === 0} onClick={() => {setJumlah(jumlah > 0 ? jumlah - 1 : jumlah)}}>-</Button>
                                                <Input type='number' contentEditable={false} value={jumlah}/>
                                                <Button className='bg-green-500' disabled={jumlah === data.STOK} onClick={() => {setJumlah(jumlah !== data.STOK ? jumlah + 1 : jumlah)}}>+</Button>
                                            </div>

                                            <div>
                                                <Button className='bg-blue-500' disabled={jumlah === 0} onClick={() => {addKeranjang(data.NAMA_PRODUK)}}>Tambah ke Keranjang</Button>
                                            </div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ))}
    </div>
  )
}

export default ReadyProdukPage