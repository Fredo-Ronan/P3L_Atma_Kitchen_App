import { getItemsFromKeranjang, getItemsHampersFromKeranjang } from "@/actions/getItemFromKeranjang.actions";
import { HAMPERS_FOR_KERANJANG, PRODUK_FOR_KERANJANG } from "@/types";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteHampersKeranjang, deleteKeranjang, updateHampersKeranjang, updateKeranjang } from "@/actions/updateKeranjang.actions";
import { getCustomerDataTrigger } from "@/actions/getCustomerData.actions";
import { countPoin } from "@/utilities/poinCounter";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ClipLoader } from "react-spinners";
import { formatDateToYYYYMMDD } from "@/utilities/dateParser";
import axios from "axios";
import { invoiceMaker } from "@/utilities/invoiceMaker";

interface Customer {
  role: string;
  id_customer: number;
  nama_customer: string;
  email_customer: string;
  tanggal_lahir: string;
  telepon: string;
  saldo: number | null;
  total_poin: number | null;
}

const Keranjang = () => {
  const [items, setItems] = useState<PRODUK_FOR_KERANJANG[]>([]);
  const [itemsHampers, setItemsHampers] = useState<HAMPERS_FOR_KERANJANG[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [totalPoin, setTotalPoin] = useState(0);
  const [isBirthday, setIsBirthday] = useState(false);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("none");
  const [pakePoin, setPakePoin] = useState(false);
  const [poinTerpakai, setPoinTerpakai] = useState(1);
  const [alamat, setAlamat] = useState("");
  const [userData, setUserData] = useState<Customer>();
  const [userPoin, setUserPoin] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoadingUserPoin, setIsLoadingUserPoin] = useState(false);

  const getUserPoin = async (userId: number) => {
    setIsLoadingUserPoin(true);
    const resGetPoin = await axios.get(`/api/customer/main/getPoin/${userId}`);

    // console.log(resGetPoin);

    setUserPoin(resGetPoin.data.poin[0].TOTAL_POIN);
    setIsLoadingUserPoin(false);
  }

  const checkout = async () => {
    setIsLoadingCheckout(true);
    const resLastNoTransaksi = await axios.get(`/api/transaksiPesanan/getLastNoTransaksi`);

    const lastNoUrut = parseInt(resLastNoTransaksi.data.lastNoTransaksi[0].NO_TRANSAKSI.split(".")[2]);

    const currentDate = new Date();
    const finalCurrentDate = formatDateToYYYYMMDD(currentDate);
    const finalCurrentNoTransaksi = `${currentDate.getFullYear() % 100}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${lastNoUrut+1}`;

    if(pakePoin){
        // API query kurangi poin customer sesuai jumlah yang di pakai (variabel poinTerpakai)
        const resKurangiPoin = await axios.post(`/api/customer/main/kurangiPoin`, {
            headers: {
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify({
                id_customer: userData?.id_customer,
                poinUpdate: userData?.total_poin! - poinTerpakai    
            })
        });
    }

    // API query insert transaksi pesanan
    const resInsertTransaksiPesanan = await axios.post(`/api/transaksiPesanan/insertTransaksiPesanan`, {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_customer: userData?.id_customer,
            no_transaksi: finalCurrentNoTransaksi,
            tanggal_pesanan: finalCurrentDate,
            alamat_pengiriman: selectedDeliveryType === "delivery" ? alamat : null,
            status_pesanan: "pending",
            tipe_pengiriman: selectedDeliveryType,
            total_item: items.length + itemsHampers.length,
            status_transaksi: "checkout, menunggu konfirmasi",
            tanggal_pengiriman: items.at(0)?.TANGGAL_PENGIRIMAN || itemsHampers.at(0)?.TANGGAL_PENGIRIMAN,
            total_harga: totalHarga,
            total_harus_dibayar: pakePoin ? totalHarga - (poinTerpakai * 100) : totalHarga
        })
    });

    const insertIdTransaksiPesanan = resInsertTransaksiPesanan.data.insertId;

    // API query insert detil transaksi
    items.forEach(async (data) => {
        const resInsert = await axios.post(`/api/detilTransaksi/insertDetilTransaksi`, {
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({
                id_transaksi_pesanan: insertIdTransaksiPesanan,
                id_produk: data.ID_PRODUK,
                jumlah_pesanan: items.length + itemsHampers.length,
                sub_total: totalHarga,
                id_hampers: null,
                id_customer: userData?.id_customer
            })
        })

        const resUpdateKuota = await axios.post(`/api/kuotaProduk/${data.ID_PRODUK}`, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tanggalKuota: data.TANGGAL_PENGIRIMAN
            })
        })

        if(data.STOK > 0){
            const resUpdateStok = await axios.post(`/api/produk/${data.ID_PRODUK}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stokUpdate: data.STOK - 1
                })
            })
        }
    })

    itemsHampers.forEach(async (data) => {
        const resInsert = await axios.post(`/api/detilTransaksi/insertDetilTransaksi`, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_transaksi_pesanan: insertIdTransaksiPesanan,
                id_produk: null,
                jumlah_pesanan: items.length + itemsHampers.length,
                sub_total: totalHarga,
                id_hampers: data.ID_HAMPERS,
                id_customer: userData?.id_customer
            })
        })
    })

    // API query update poin customer
    const resUpdatePoin = await axios.post(`/api/customer/main/tambahPoin`, {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_customer: userData?.id_customer,
            updatePoin: userPoin + totalPoin
        })
    })


    invoiceMaker(finalCurrentNoTransaksi, finalCurrentDate, items.at(0)?.TANGGAL_PENGIRIMAN! || itemsHampers.at(0)?.TANGGAL_PENGIRIMAN!, userData?.nama_customer!, alamat, selectedDeliveryType, items, itemsHampers, totalHarga, pakePoin ? poinTerpakai : 0);
    // delete all items from keranjang
    deleteAllItemInKeranjang();
  }

  const deleteItemFromKeranjang = async (namaProduk: string) => {
    const indexToRemove = items.findIndex(data => data.NAMA_PRODUK === namaProduk);

    if (indexToRemove !== -1) {
      const newItems = items.filter((_, index) => index !== indexToRemove);
      setItems(newItems);
      await updateKeranjang(newItems);
      window.location.reload();
    }
  };

  const deleteItemHampersFromKeranjang = async (namaHampers: string) => {
    const indexToRemove = itemsHampers.findIndex(data => data.NAMA_HAMPERS === namaHampers);

    if (indexToRemove !== -1) {
      const newItems = itemsHampers.filter((_, index) => index !== indexToRemove);
      setItemsHampers(newItems);
      await updateHampersKeranjang(newItems);
      window.location.reload();
    }
  }

  const deleteAllItemInKeranjang = async () => {
    await deleteKeranjang();
    await deleteHampersKeranjang();
    window.location.reload();
  };

  const countTotalHarga = async () => {
    let countHarga = 0;
    items.forEach((data) => {
      countHarga += data.HARGA_PRODUK;
    });

    itemsHampers.forEach((data) => {
        countHarga += data.HARGA_HAMPERS;
    })

    setTotalHarga(countHarga);
    const poin = await countPoin(countHarga, userData?.tanggal_lahir);
    setTotalPoin(poin.poin);
    setIsBirthday(poin.birthday);
  };

  const getCustomerData = async () => {
    const userDataResult = await getCustomerDataTrigger();
    setUserData(JSON.parse(userDataResult!));
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchFromKeranjang = async () => {
      setIsLoading(true);
      const keranjang = await getItemsFromKeranjang();
      setItems(keranjang);
      countTotalHarga();
    };

    const fetchHampersFromKeranjang = async () => {
        const keranjangHampers = await getItemsHampersFromKeranjang();
        setItemsHampers(keranjangHampers);
        countTotalHarga();
    }

    fetchFromKeranjang();
    fetchHampersFromKeranjang();
    getCustomerData();
  }, []);

  useEffect(() => {
    if (userData?.id_customer) {
      getUserPoin(userData.id_customer);
    }
  }, [userData]);

  useEffect(() => {
    countTotalHarga();
  }, [items, itemsHampers]);

  return (
    <div className="mx-24 my-9 font-poetsen">
      <h1 className="font-bold text-xl mb-6">Keranjang Anda</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={60} />
        </div>
      ) : (
        <div>
          <div className="flex gap-4">
            {items.length !== 0 || itemsHampers.length !== 0 ? (
              <div className="overflow-y-scroll w-3/4 max-h-svh">
                {items.map((data, index) => (
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
                    <IconContext.Provider value={{ color: "red" }}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="flex items-end hover:cursor-pointer">
                            <FaTrash size={20} />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Yakin ingin menghapus {data.NAMA_PRODUK} dari keranjang?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini akan menghapus produk {data.NAMA_PRODUK} dari keranjang pesanan anda
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-red-500 hover:bg-red-700 text-white hover:text-white">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-blue-500"
                              onClick={() => {
                                deleteItemFromKeranjang(data.NAMA_PRODUK);
                              }}
                            >
                              Ya
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </IconContext.Provider>
                  </div>
                ))}

                {itemsHampers.map((data, index) => (
                    <div
                    className="mb-4 flex gap-4 px-4 py-4 bg-slate-50 shadow-lg"
                    key={index}
                  >
                    <div className="w-full">
                      <div className="flex gap-2">
                        <p>{data.NAMA_HAMPERS}</p>
                        <p className="italic opacity-50">{data.DESKRIPSI_HAMPERS.split("+")[1]}</p>
                      </div>
                      <p>Rp. {data.HARGA_HAMPERS.toLocaleString("id-ID")}</p>
                    </div>
                    <IconContext.Provider value={{ color: "red" }}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="flex items-end hover:cursor-pointer">
                            <FaTrash size={20} />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Yakin ingin menghapus {data.NAMA_HAMPERS} dari keranjang?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini akan menghapus produk {data.NAMA_HAMPERS} dari keranjang pesanan anda
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-red-500 hover:bg-red-700 text-white hover:text-white">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-blue-500"
                              onClick={() => {
                                deleteItemHampersFromKeranjang(data.NAMA_HAMPERS);
                              }}
                            >
                              Ya
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </IconContext.Provider>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-3/4 max-h-svh flex justify-center items-center font-bold text-xl">
                Kosong :(
              </div>
            )}

            <div className="shadow-inner p-6 w-full flex flex-col justify-between">
              <div>
                <h1 className="font-bold text-2xl">Detil Pesanan Anda</h1>
                <p className="mt-2 text-lg">
                  Tanggal Pengiriman : {items.at(0)?.TANGGAL_PENGIRIMAN || itemsHampers.at(0)?.TANGGAL_PENGIRIMAN}
                </p>
              </div>

              <div className="my-2">
                <h1 className="font-bold">Detil produk yang anda pesan</h1>
                {items.map((data, index) => (
                  <div className="flex w-1/2 justify-between" key={index}>
                    <div className="flex gap-1">
                      <p>{data.NAMA_PRODUK}</p>
                      <p>{data.LOYANG}</p>
                    </div>
                    <p>Rp. {data.HARGA_PRODUK.toLocaleString("id-ID")}</p>
                  </div>
                ))}

                {itemsHampers.map((data, index) => (
                  <div className="flex w-1/2 justify-between" key={index}>
                    <div className="flex gap-1">
                      <p>{data.NAMA_HAMPERS}</p>
                    </div>
                    <p>Rp. {data.HARGA_HAMPERS.toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>

              <div className="my-2">
                <Select
                  onValueChange={(content) => setSelectedDeliveryType(content)}
                  defaultValue="none"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Tipe Pengiriman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none" disabled>Pilih Tipe Pengiriman</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {selectedDeliveryType === "delivery" ? (
                <div>
                  <Textarea
                    placeholder="Masukkan alamat pengiriman anda..."
                    onChange={(value) => {
                      setAlamat(value.target.value);
                    }}
                  />
                </div>
              ) : null}

              <div className="my-2 border-2 p-2">
                <p className="">
                  Poin yang anda dapatkan dari transaksi ini :
                </p>
                <p className="font-bold text-xl">{totalPoin} poin</p>
                {isBirthday ? (
                  <p className="italic font-bold">
                    Anda mendapatkan double poin karena hari ulang tahun anda
                  </p>
                ) : null}
              </div>

              <div className="my-2 border-2 p-2">
                <p className="italic opacity-50">
                  Anda bisa menggunakan sisa poin yang anda miliki untuk memotong harga total anda
                </p>
                <p>Sisa poin anda :</p>
                {isLoadingUserPoin ?
                    <ClipLoader/>
                    : <p className="font-bold text-xl">
                    {userPoin} poin
                  </p>
                }

                {userData?.total_poin === null ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 mt-4 w-fit">
                          <Checkbox disabled={userData?.total_poin === null} />
                          <p className={userData?.total_poin === null ? "opacity-50" : ""}>
                            Gunakan poin
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-red-500">
                        <p className="text-white">Anda tidak memiliki poin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mt-4">
                      <Checkbox
                        onCheckedChange={(value) => {
                          setPakePoin(value === true ? true : false);
                        }}
                      />
                      <p>Gunakan poin</p>
                    </div>
                    {pakePoin ? (
                      <div className="flex items-center w-fit mt-2">
                        <Button
                          className="bg-red-500 mr-4"
                          onClick={() => {
                            setPoinTerpakai(1);
                          }}
                        >
                          MIN
                        </Button>
                        <Button
                          className="bg-red-500"
                          onClick={() => {
                            setPoinTerpakai(poinTerpakai > 1 ? poinTerpakai - 1 : poinTerpakai);
                          }}
                        >
                          -
                        </Button>
                        <Input type="number" value={poinTerpakai} readOnly />
                        <Button
                          className="bg-green-500"
                          onClick={() => {
                            setPoinTerpakai(
                              poinTerpakai < userPoin ? poinTerpakai + 1 : poinTerpakai
                            );
                          }}
                        >
                          +
                        </Button>
                        <Button
                          className="bg-blue-500 ml-4"
                          onClick={() => {
                            setPoinTerpakai(userPoin);
                          }}
                        >
                          MAX
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div>
                <p className="text-3xl font-bold mt-4">
                  Total : Rp. {pakePoin ? (totalHarga - poinTerpakai * 100).toLocaleString("id-ID") : totalHarga.toLocaleString("id-ID")}
                </p>
                <Button
                  className="bg-blue-500 mt-2"
                  disabled={
                    (items.length === 0 && itemsHampers.length === 0) ||
                    selectedDeliveryType === "none" ||
                    (alamat === "" && selectedDeliveryType !== "pickup")
                  }
                  onClick={() => {checkout()}}
                >
                  {isLoadingCheckout ? <ClipLoader/> : "Checkout"}
                </Button>
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex items-end">
                <Button
                  className="bg-red-500 hover:bg-red-700"
                  disabled={items.length !== 0 || itemsHampers.length !== 0 ? false : true}
                >
                  Kosongkan Keranjang
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin ingin mengosongkan keranjang?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini akan menghapus semua produk di keranjang pesanan anda
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-red-500 hover:bg-red-700 text-white hover:text-white">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-blue-500"
                  onClick={deleteAllItemInKeranjang}
                >
                  Ya
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default Keranjang;
