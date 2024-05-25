import { HAMPERS, HAMPERS_FOR_KERANJANG, PRODUK } from '@/types'
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addToHampersKeranjang } from '@/actions/addToKeranjang.actions';
  
  interface DETIL_GAMBAR {
    nama_hampers: string;
    gambar_produk: PRODUK[];
}

const HampersPage = ({ dataHampers, selectedDate }: { dataHampers: HAMPERS[], selectedDate: string }) => {

    const [gambar, setGambar] = useState<DETIL_GAMBAR[]>([]);
    const [jumlah, setJumlah] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch gambar produk
  const getGambar = async () => {
    setIsLoading(true);
    try {
      const gambarPromises = dataHampers.map(async (data) => {
        const resGambar = await fetch(`/api/hampers/${data.ID_HAMPERS}`);
        if (!resGambar.ok) {
          throw new Error(`Failed to fetch: ${resGambar.statusText}`);
        }
        const resFinal = await resGambar.json();
        // console.log(`Fetched data for hampers ID ${data.ID_HAMPERS}:`, resFinal);
        return { nama_hampers: data.NAMA_HAMPERS, gambar_produk: resFinal.detilHampers };
      });
  
      const allGambar = await Promise.all(gambarPromises);
      setGambar(allGambar);
    } catch (error) {
      console.error("Error fetching gambar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addHampersToKeranjang = async (namaHampers: string) => {
    let itemsHampers: HAMPERS_FOR_KERANJANG[] = [];

    const hampers = dataHampers.find(data => data.NAMA_HAMPERS === namaHampers);

    if(hampers){
        for(let i = 0; i < jumlah; i++){
            itemsHampers.push({
                ID_HAMPERS: hampers.ID_HAMPERS,
                NAMA_HAMPERS: hampers.NAMA_HAMPERS,
                DESKRIPSI_HAMPERS: hampers.DESKRIPSI_HAMPERS,
                HARGA_HAMPERS: hampers.HARGA_HAMPERS,
                TANGGAL_PENGIRIMAN: selectedDate
            });
        }
    }

    await addToHampersKeranjang(itemsHampers);
    window.location.reload();
  }

  useEffect(() => {
    getGambar();
  }, [dataHampers]);

  return (
    <div className='flex flex-wrap gap-4'>
        {dataHampers.map((data, index) => (
            <div className='mb-4 w-1/3' key={index}>
                <Card>
                    <CardHeader>
                        <CardTitle>{data.NAMA_HAMPERS}</CardTitle>
                        <CardDescription>{data.DESKRIPSI_HAMPERS.split("+")[0]}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex gap-4'>
                            {gambar.map((dataDetilHampers, index) => {
                                if(dataDetilHampers.nama_hampers === data.NAMA_HAMPERS){
                                    return dataDetilHampers.gambar_produk.map((detil, indexDetil) => (
                                        <div key={`${index}-${indexDetil}`} className='w-full'>
                                            <div className="flex justify-center">
                                                <div className="relative w-full h-52">
                                                    <img
                                                    src={detil.GAMBAR_PRODUK}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex'>
                                                <p>{detil.NAMA_PRODUK}</p>
                                                <p className='italic opacity-50'>&nbsp;{detil.LOYANG}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            })
                            }
                        </div>
                        
                        {data.DESKRIPSI_HAMPERS.includes("+ Exclusive") ?
                            <div className='mt-2'>
                                <p className='font-bold italic text-lg'>+ {data.DESKRIPSI_HAMPERS.split("+")[1]} 🙌</p>
                            </div>
                            : <></>
                        }

                        <div className='mt-6'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='bg-blue-500' disabled={selectedDate === "" ? true : false}>Tambah ke Keranjang</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Tambah Hampers {data.NAMA_HAMPERS} ke keranjang?</DialogTitle>
                                <DialogDescription>
                                    <div className='space-y-4'>
                                        <p className='italic opacity-70'>Isikan berapa banyak hampers yang ingin anda pesan?</p>
                                        <div className='flex w-fit'>
                                            <Button className='bg-red-500' disabled={jumlah === 0} onClick={() => {setJumlah(jumlah > 0 ? jumlah - 1 : jumlah)}}>-</Button>
                                            <Input type='number' contentEditable={false} value={jumlah}/>
                                            <Button className='bg-green-500' onClick={() => {setJumlah(jumlah + 1)}}>+</Button>
                                        </div>

                                        <div>
                                            <Button className='bg-blue-500' onClick={() => {addHampersToKeranjang(data.NAMA_HAMPERS)}}>Tambah ke Keranjang</Button>
                                        </div>
                                    </div>
                                </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        </div>
                    </CardContent>
                    <CardFooter>
                        
                    </CardFooter>
                </Card>     
            </div>     
        ))

        }
    </div>
  )
}

export default HampersPage