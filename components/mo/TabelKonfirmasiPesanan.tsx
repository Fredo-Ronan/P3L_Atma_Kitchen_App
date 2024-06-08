"use client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTanggal } from "@/lib/utils";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Link from "next/link";

const TabelKonfirmasiPesanan = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isKurang, setIsKurang] = useState(false);
  const [bahanKurang, setBahanKurang] = useState<any[]>([]); // [id_bahan, jumlah_kurang
  const btnRef = useRef(null);
  const { toast } = useToast();
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/pesananKonfirmasi");
      setData(res.data);
      console.log(data);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/pesananKonfirmasi/${id}`);
      toast({
        title: "Berhasil",
        description: "Pesanan berhasil ditolak",
      });
      fetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await axios.put(`/api/pesananKonfirmasi/${id}`);
      if (res.data.status === "kurang") {
        setIsKurang(true);
        setBahanKurang(res.data.listKurangBahan);
        return;
      }
      toast({
        title: "Berhasil",
        description: "Pesanan berhasil dikonfirmasi",
      });
      fetchData();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isKurang)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Bahan</TableHead>
            <TableHead>Jumlah Kurang</TableHead>
            <TableHead>Satuan</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bahanKurang.map((item) => (
            <TableRow key={item.id_bahan}>
              <TableCell>{item.NAMA_BAHAN}</TableCell>
              <TableCell>{item.JUMLAH_KURANG}</TableCell>
              <TableCell>{item.SATUAN}</TableCell>
              <TableCell className="flex items-center gap-2 justify-center">
                <button
                  className="bg-none text-red-500 border-none outline-none underline"
                  onClick={() => setIsKurang(false)}
                >
                  Kembali
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor Transaksi Pesanan</TableHead>
          <TableHead>Tanggal Pesanan</TableHead>
          <TableHead>Tipe Pengiriman</TableHead>
          <TableHead>Tanggal Pengiriman</TableHead>
          <TableHead>Alamat Pengiriman</TableHead>
          <TableHead>Total Bayar</TableHead>
          <TableHead>Total yang Dibayarkan</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.ID_TRANSAKSI_PESANAN}>
            <TableCell>{item.NO_TRANSAKSI}</TableCell>
            <TableCell>{formatTanggal(item.TANGGAL_PESANAN)}</TableCell>
            <TableCell>{item.TIPE_PENGIRIMAN}</TableCell>
            <TableCell>{formatTanggal(item.TANGGAL_PENGIRIMAN)}</TableCell>
            <TableCell>{item.ALAMAT_PENGIRIMAN}</TableCell>
            <TableCell>Rp. {item.TOTAL_HARUS_DIBAYAR}</TableCell>
            <TableCell>Rp. {item.TOTAL_BAYAR_CUSTOMER}</TableCell>
            <TableCell className="flex justify-center gap-2">
              <KonfirmasiBtn
                variant="destructive"
                trigger="Tolak"
                handleClick={() => handleDelete(item.ID_TRANSAKSI_PESANAN)}
                title="Tolak"
              />
              <KonfirmasiBtn
                variant="default"
                trigger="Setuju"
                handleClick={() => handleSubmit(item.ID_TRANSAKSI_PESANAN)}
                title="Setuju"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

type KonfirmasiBtnProps = {
  handleClick: () => void;
  title: string;
  variant: "destructive" | "default";
  trigger: string;
};

const KonfirmasiBtn = ({
  handleClick,
  title,
  variant,
  trigger,
}: KonfirmasiBtnProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant}>{trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to continue?{" "}
            {title} pesanan ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>{title}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TabelKonfirmasiPesanan;
