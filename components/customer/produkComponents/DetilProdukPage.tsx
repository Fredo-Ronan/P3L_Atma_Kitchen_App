import { PRODUK, PRODUK_FOR_CUSTOMER_UI } from '@/types'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { addToKeranjang } from '@/actions/addToKeranjang.actions'
import { getCustomerDataTrigger } from '@/actions/getCustomerData.actions'

const DetilProdukPage = ({ produk }: { produk: PRODUK_FOR_CUSTOMER_UI }) => {
  const [customerData, setCustomerData] = useState<string | null>(null);
    const [jumlahSatuLoyang, setJumlahSatuLoyang] = useState(0);
    const [jumlahSetengahLoyang, setJumlahSetengahLoyang] = useState(0);
    const [jumlah, setJumlah] = useState(0); // untuk tracking jumlah produk selain cake termasuk produk titipan/ready stock
    const [hargaTotal, setHargaTotal] = useState(0);
    const [checkSatuLoyang, setCheckSatuLoyang] = useState(false);
    const [checkSetengahLoyang, setCheckSetengahLoyang] = useState(false);

    const resetAll = () => {
        setCheckSatuLoyang(false);
        setCheckSetengahLoyang(false);
        setJumlahSatuLoyang(0);
        setJumlahSetengahLoyang(0);
        setJumlah(0);
        setHargaTotal(0);
    }

    const isCustomerLoggedIn = async () => {
      const customer = await getCustomerDataTrigger();
      setCustomerData(customer);
    }

    const addToKeranjangTrigger = async () => {

        let produkToAdd: PRODUK[] = [];

        if(checkSatuLoyang && checkSetengahLoyang){
            // brarti customer ambil 1 loyang dan 1/2 loyang
            for(let i = 0; i < jumlahSatuLoyang; i++){
                produkToAdd.push({
                    ID_PRODUK: produk.ID_PRODUK,
                    NAMA_PRODUK: produk.NAMA_PRODUK,
                    DESKRIPSI_PRODUK: produk.DESKRIPSI_PRODUK,
                    JENIS_PRODUK: produk.JENIS_PRODUK,
                    JENIS_MAKANAN: produk.JENIS_MAKANAN,
                    GAMBAR_PRODUK: produk.GAMBAR_PRODUK,
                    HARGA_PRODUK: produk.HARGA_PRODUK[0],
                    LOYANG: produk.LOYANG[0],
                    STATUS_PRODUK: produk.STATUS_PRODUK,
                    STOK: produk.STOK
                });
            }

            for(let i = 0; i < jumlahSetengahLoyang; i++){
                produkToAdd.push({
                    ID_PRODUK: produk.ID_PRODUK,
                    NAMA_PRODUK: produk.NAMA_PRODUK,
                    DESKRIPSI_PRODUK: produk.DESKRIPSI_PRODUK,
                    JENIS_PRODUK: produk.JENIS_PRODUK,
                    JENIS_MAKANAN: produk.JENIS_MAKANAN,
                    GAMBAR_PRODUK: produk.GAMBAR_PRODUK,
                    HARGA_PRODUK: produk.HARGA_PRODUK[1],
                    LOYANG: produk.LOYANG[1],
                    STATUS_PRODUK: produk.STATUS_PRODUK,
                    STOK: produk.STOK
                });
            }

        } else if(checkSatuLoyang) {
            // brrati customer ambil 1 loyang doang
            for(let i = 0; i < jumlahSatuLoyang; i++){
                produkToAdd.push({
                    ID_PRODUK: produk.ID_PRODUK,
                    NAMA_PRODUK: produk.NAMA_PRODUK,
                    DESKRIPSI_PRODUK: produk.DESKRIPSI_PRODUK,
                    JENIS_PRODUK: produk.JENIS_PRODUK,
                    JENIS_MAKANAN: produk.JENIS_MAKANAN,
                    GAMBAR_PRODUK: produk.GAMBAR_PRODUK,
                    HARGA_PRODUK: produk.HARGA_PRODUK[0],
                    LOYANG: produk.LOYANG[0],
                    STATUS_PRODUK: produk.STATUS_PRODUK,
                    STOK: produk.STOK
                });
            }
        } else if(checkSetengahLoyang){
            // brarti custoer ambil 1/2 loyang doang
            for(let i = 0; i < jumlahSetengahLoyang; i++){
                produkToAdd.push({
                    ID_PRODUK: produk.ID_PRODUK,
                    NAMA_PRODUK: produk.NAMA_PRODUK,
                    DESKRIPSI_PRODUK: produk.DESKRIPSI_PRODUK,
                    JENIS_PRODUK: produk.JENIS_PRODUK,
                    JENIS_MAKANAN: produk.JENIS_MAKANAN,
                    GAMBAR_PRODUK: produk.GAMBAR_PRODUK,
                    HARGA_PRODUK: produk.HARGA_PRODUK[1],
                    LOYANG: produk.LOYANG[1],
                    STATUS_PRODUK: produk.STATUS_PRODUK,
                    STOK: produk.STOK
                });
            }
        }

        // console.log(produkToAdd);
        await addToKeranjang(produkToAdd);
        window.location.reload();
    }

    useEffect(() => {
      isCustomerLoggedIn();
    }, [produk]);

  return (
    <Dialog>
      {customerData !== null ? 
      <DialogTrigger asChild>
        <Button className='bg-blue-500' onClick={() => resetAll()}>Pesan Sekarang</Button>
      </DialogTrigger>
      : <div>
        <p className='font-bold text-red-500'>Login untuk memesan</p>
      </div>
      }
      <DialogContent className="max-w-3xl w-auto p-4">
        <DialogHeader>
          <DialogTitle>{produk.NAMA_PRODUK}</DialogTitle>
          <DialogDescription>
            Detil dari Lapis Legit
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-6">
          <img src={produk.GAMBAR_PRODUK} alt="" className="w-1/3 h-auto" />
          <div className="flex flex-col space-y-4 w-full">
            <div>
              <h1 className='text-2xl'>Deskripsi</h1>
              <p>{produk.DESKRIPSI_PRODUK}</p>
            </div>
            <div className=''>
              <h1 className='text-lg'>Atur pesanan anda</h1>

              {produk.JENIS_MAKANAN === "Cake" ?
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <Checkbox onCheckedChange={() => setCheckSatuLoyang(!checkSatuLoyang)}/>
                            <p>1 Loyang</p>
                            <p className='ml-12'>Rp. {produk.HARGA_PRODUK[0].toLocaleString('id-ID')}</p>
                        </div>


                        <div className='flex'>
                            <Button className='bg-red-500' disabled={jumlahSatuLoyang === 0 ? true : false} onClick={() => {setJumlahSatuLoyang(jumlahSatuLoyang > 0 ? jumlahSatuLoyang - 1 : jumlahSatuLoyang); setHargaTotal(hargaTotal - produk.HARGA_PRODUK[0])}}>-</Button>
                            <Input type='text' className='w-12 text-center' value={jumlahSatuLoyang}/>
                            <Button className='bg-green-500' disabled={!checkSatuLoyang} onClick={() => {setJumlahSatuLoyang(jumlahSatuLoyang + 1); setHargaTotal(hargaTotal + produk.HARGA_PRODUK[0])}}>+</Button>
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <Checkbox onCheckedChange={() => setCheckSetengahLoyang(!checkSetengahLoyang)}/>
                            <p>½ Loyang</p>
                            <p className='ml-10'>Rp. {produk.HARGA_PRODUK[1].toLocaleString('id-ID')}</p>
                        </div>


                        <div className='flex'>
                            <Button className='bg-red-500' disabled={jumlahSetengahLoyang === 0 ? true : false} onClick={() => {setJumlahSetengahLoyang(jumlahSetengahLoyang > 0 ? jumlahSetengahLoyang - 1 : jumlahSetengahLoyang); setHargaTotal(hargaTotal - produk.HARGA_PRODUK[1])}}>-</Button>
                            <Input type='text' className='w-12 text-center' value={jumlahSetengahLoyang}/>
                            <Button className='bg-green-500' disabled={!checkSetengahLoyang} onClick={() => {setJumlahSetengahLoyang(jumlahSetengahLoyang + 1); setHargaTotal(hargaTotal + produk.HARGA_PRODUK[1])}}>+</Button>
                        </div>
                    </div>
                </div> : <>
                    {/* Untuk yang bukan cake */}
                </>
              }
            </div>

            <div>
                Rp. {hargaTotal.toLocaleString('id-ID')}
            </div>

            <div>
                <DialogClose asChild>
                    <Button className='bg-blue-500' disabled={(checkSatuLoyang || checkSetengahLoyang) && (jumlahSatuLoyang > 0 || jumlahSetengahLoyang > 0) ? false : true} onClick={() => addToKeranjangTrigger()}>Tambah ke Keranjang</Button>
                </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DetilProdukPage