import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { BAHAN_BAKU, DETAIL_RESEP, DETIL_TRANSAKSI, PRODUK, TRANSAKSI_PESANAN } from "@/types";
import { Button } from "../ui/button";
import axios from "axios";

interface COLLECTION_DETIL_TRANSAKSI {
    id_transaksi: number;
    detil_transaksi: DETIL_TRANSAKSI[];
}

interface COLLECTION_PRODUK_PER_TRANSAKSI {
    id_transaksi: number;
    produk: PRODUK[];
}

const TabelPesananHarusDiproses = ({ dataPesanan, dataBahan }: { dataPesanan?: TRANSAKSI_PESANAN[], dataBahan?: BAHAN_BAKU[] }) => {
    const [isPilihSemua, setIsPilihSemua] = useState(false);
    const [detilTiapDataPesanan, setDetilTiapDataPesanan] = useState<COLLECTION_DETIL_TRANSAKSI[]>([]);
    const [detilProdukPerTransaksi, setDetilProdukPerTransaksi] = useState<COLLECTION_PRODUK_PER_TRANSAKSI[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getEachDetailTransaksi = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const promises: Promise<COLLECTION_DETIL_TRANSAKSI>[] = [];
            dataPesanan?.forEach((data) => {
                promises.push(
                    (async () => {
                        const resDetilTransaksi = await axios.get(`/api/getDetilTransaksi/${data.ID_TRANSAKSI_PESANAN}`);
                        const detilTransaksi: DETIL_TRANSAKSI[] = resDetilTransaksi.data.dataDetilTransaksi;
                        return {
                            id_transaksi: data.ID_TRANSAKSI_PESANAN,
                            detil_transaksi: detilTransaksi
                        };
                    })()
                );
            });

            const detilData = await Promise.all(promises);
            setDetilTiapDataPesanan(detilData);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getIdResepPerTransaksi = async () => {
        console.log("HMMMMMMMMMMMMMMMMM")
        try {
            const updatedDetilProdukPerTransaksi: COLLECTION_PRODUK_PER_TRANSAKSI[] = [];

            for (const data of detilTiapDataPesanan) {
                let dataProduk: PRODUK[] = [];
                for (const dataDetil of data.detil_transaksi) {
                    const resProduk = await axios.get(`/api/produk/getCertainProduk/${dataDetil.ID_PRODUK}`);
                    console.log(resProduk.data.dataProduk);
                    dataProduk.push(resProduk.data.dataProduk);
                }

                console.log(dataProduk);
                
                const collectionProdukPerTransaksi: COLLECTION_PRODUK_PER_TRANSAKSI = {
                    id_transaksi: data.id_transaksi,
                    produk: dataProduk
                };

                updatedDetilProdukPerTransaksi.push(collectionProdukPerTransaksi);
            }

            setDetilProdukPerTransaksi(updatedDetilProdukPerTransaksi);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        getEachDetailTransaksi();
    }, []);

    useEffect(() => {
        console.log(detilTiapDataPesanan);
        if (detilTiapDataPesanan.length > 0) {
            getIdResepPerTransaksi();
        }

    }, [detilTiapDataPesanan]);

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button className={isPilihSemua ? "bg-red-500" : "bg-blue-500"} onClick={() => { setIsPilihSemua(!isPilihSemua) }}>
                    {isPilihSemua ? "Batal" : "Pilih Semua"}
                </Button>
            </div>
            <Table>
                <TableCaption>List pesanan harus di proses hari ini</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">No Transaksi</TableHead>
                        <TableHead className="w-[150px]">Tanggal Pesanan</TableHead>
                        <TableHead className="w-[170px]">Tanggal Pengiriman</TableHead>
                        <TableHead>Alamat Pengiriman</TableHead>
                        <TableHead className="w-[150px]">Tipe Pengiriman</TableHead>
                        <TableHead className="w-[100px]">Total Item</TableHead>
                        <TableHead>Status Transaksi</TableHead>
                        <TableHead>Detil Transaksi</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataPesanan?.map((data, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{data.NO_TRANSAKSI}</TableCell>
                            <TableCell>{data.TANGGAL_PESANAN?.split("T")[0]}</TableCell>
                            <TableCell>{data.TANGGAL_PENGIRIMAN?.split("T")[0]}</TableCell>
                            <TableCell>{data.ALAMAT_PENGIRIMAN}</TableCell>
                            <TableCell>{data.TIPE_PENGIRIMAN}</TableCell>
                            <TableCell>{data.TOTAL_ITEM}</TableCell>
                            <TableCell>{data.STATUS_TRANSAKSI}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <p className="text-blue-500 underline hover:cursor-pointer">Detil Bahan Dibutuhkan</p>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Detil Bahan Dibutuhkan</DialogTitle>
                                            <DialogDescription>
                                                {detilProdukPerTransaksi.map((dataDetilProduk, index) => {
                                                    if (data.ID_TRANSAKSI_PESANAN === dataDetilProduk.id_transaksi) {
                                                        return <>
                                                            {dataDetilProduk.produk.map((produk, indexProduk) => (
                                                                <p key={indexProduk}>{produk.NAMA_PRODUK}</p>
                                                            ))}
                                                        </>
                                                    }
                                                    return null;
                                                })}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>
                                <Button disabled={isPilihSemua} className={isPilihSemua ? "bg-green-500" : "bg-yellow-500"}>
                                    {isPilihSemua ? "Terpilih" : "Proses"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TabelPesananHarusDiproses;
