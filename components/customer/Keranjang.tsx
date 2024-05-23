import { getItemsFromKeranjang } from "@/actions/getItemFromKeranjang.actions";
import { PRODUK_FOR_KERANJANG } from "@/types";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { Button } from "../ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { deleteKeranjang, updateKeranjang } from "@/actions/updateKeranjang.actions";
  

const Keranjang = () => {
  const [items, setItems] = useState<PRODUK_FOR_KERANJANG[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("none");

  const deleteItemFromKeranjang = async (namaProduk: string) => {
    const indexToRemove = items.findIndex(data => data.NAMA_PRODUK === namaProduk);

    if(indexToRemove !== -1){
        const newItems = items.filter((_, index) => index !== indexToRemove);
        setItems(newItems);
        await updateKeranjang(newItems);
        window.location.reload();
    }
  }

  const deleteAllItemInKeranjang = async () => {
    await deleteKeranjang();
    window.location.reload();
  }

  const countTotalHarga = () => {
    let countHarga = 0;
    items.forEach((data) => {
        countHarga += data.HARGA_PRODUK
    })

    setTotalHarga(countHarga);
  }

  useEffect(() => {
    const fetchFromKeranjang = async () => {
        const keranjang = await getItemsFromKeranjang();
        setItems(keranjang);
        // console.log(keranjang);
        countTotalHarga();
    };

    fetchFromKeranjang();
  }, []);

  useEffect(() => {
    countTotalHarga();
    }, [items]);

  return (
    <div className="mx-24 my-9 font-poetsen">
        <h1 className="font-bold text-xl mb-6">Keranjang Anda</h1>
        <div>
            <div className="flex gap-4">
                {items.length !== 0 ?
                
                <div className="overflow-y-scroll w-3/4 max-h-svh">
                    {
                        items.map((data, index) => (
                            <div
                            className="mb-4 flex gap-4 px-4 py-4 bg-slate-50 shadow-lg"
                            key={index}
                            >
                                <img src={data.GAMBAR_PRODUK} alt="" width={100} />
                                <div className="w-full">
                                    <div className="flex gap-2">
                                    <p>{data.NAMA_PRODUK}</p>
                                    <p className="italic opacity-50">{data.LOYANG}</p>
                                    </div>
                                    <p>Rp. {data.HARGA_PRODUK.toLocaleString("id-ID")}</p>
                                </div>
                                <IconContext.Provider
                                    value={{ color: 'red' }}
                                    >
                                    <AlertDialog>
                                        <AlertDialogTrigger className="flex items-end">
                                            <FaTrash size={20} />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Yakin ingin menghapus {data.NAMA_PRODUK} dari keranjang?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tindakan ini akan menghapus produk {data.NAMA_PRODUK} dari keranjang pesanan anda
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-red-500 hover:bg-red-700 text-white hover:text-white">Batal</AlertDialogCancel>
                                            <AlertDialogAction className="bg-blue-500" onClick={() => {deleteItemFromKeranjang(data.NAMA_PRODUK)}}>Ya</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </IconContext.Provider>
                            </div>
                        ))
                        
                    }
                </div> : 
                <div className="w-3/4 max-h-svh flex justify-center items-center font-bold text-xl">
                    Kosong :(
                </div>
                }

                <div className="shadow-inner p-6 w-full flex flex-col justify-between">
                    <div>
                        <h1 className="font-bold text-2xl">Detil Pesanan Anda</h1>
                        <p className="mt-2 text-lg">Tanggal Pengiriman : {items.at(0)?.TANGGAL_PENGIRIMAN}</p>
                    </div>

                    <div className="">
                        <h1 className="font-bold">Detil produk yang anda pesan</h1>
                        {items.map((data, index) => (
                            <div className="flex w-1/2 justify-between" key={index}>
                                <div className="flex gap-1">
                                    <p>{data.NAMA_PRODUK}</p>
                                    <p>{data.LOYANG}</p>
                                </div>
                                <p>Rp. {data.HARGA_PRODUK.toLocaleString("id-ID")}</p>
                            </div>
                        ))

                        }
                    </div>

                    <div>
                        <Select onValueChange={(content) => setSelectedDeliveryType(content)} defaultValue="none">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Tipe Pengiriman" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilih Tipe Pengiriman</SelectLabel>
                                    <SelectItem value="delivery">Delivery</SelectItem>
                                    <SelectItem value="pickup">Pickup</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <div>
                        <p className="text-3xl font-bold">Total : Rp. {totalHarga.toLocaleString("id-ID")}</p>
                        <Button className="bg-blue-500 mt-2" disabled={items.length !== 0 && selectedDeliveryType !== "none" ? false : true}>Checkout</Button>
                    </div>
                </div>
            </div>
            <AlertDialog>
                <Button className="bg-red-500 hover:bg-red-700" disabled={items.length !== 0 ? false : true}>
                    <AlertDialogTrigger className="flex items-end">
                        Kosongkan Keranjang
                    </AlertDialogTrigger>
                </Button>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Yakin ingin mengosongkan keranjang?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini akan menghapus semua produk di keranjang pesanan anda
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel className="bg-red-500 hover:bg-red-700 text-white hover:text-white">Batal</AlertDialogCancel>
                    <AlertDialogAction className="bg-blue-500" onClick={() => {deleteAllItemInKeranjang()}}>Ya</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
  );
};

export default Keranjang;
