"use client";
import { formatTanggal } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import axios from "axios";
import { toast } from "sonner";
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

interface Props {
  data: any;
}

const KonfirmasiPesanan = ({ data }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pesanan, setPesanan] = useState([]);

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/konfirmasiPesanan/${data.id_customer}`
      );
      const result = await response.data;
      setPesanan(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  console.log(pesanan);
  return isLoading ? (
    <div className="min-h-[70vh] flex items-center justify-center">
      <ClipLoader size={60} />
    </div>
  ) : (
    <div className="flex flex-col space-y-8 py-12">
      {pesanan.map((item: any) => (
        <Card
          key={item.id_transaksi_pesanan}
          item={item}
          fetchPesanan={fetchPesanan}
        />
      ))}
    </div>
  );
};

const Card = ({ item, fetchPesanan }: any) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`/api/konfirmasiPesanan/${item.id_transaksi_pesanan}`, {
        status_presensi: "selesai",
      });
      toast.success("Pesanan Anda Telah Diterima");
      fetchPesanan();
    } catch (error) {
      toast.error("Gagal Update Status Pesanan");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full p-8 shadow-sm border rounded-2xl flex flex-col space-y-2">
      <span>
        Tanggal transaksi:{" "}
        <span className="font-semibold">
          {formatTanggal(item.tanggal_pesanan)}
        </span>{" "}
      </span>
      <div className="flex items-center gap-2">
        <span className="items-center gap-2">
          Status pesanan:{" "}
          <Badge
            variant="secondary"
            className="font-semibold inline-block text-orange-600"
          >
            {item.status_pesanan}
          </Badge>
        </span>
      </div>
      <div className="space-y-3">
        <p>
          Nomor transaksi:{" "}
          <span className="font-semibold">{item.no_transaksi}</span>
        </p>
        {item.alamat_pengiriman && (
          <p>
            Alamat pengiriman:{" "}
            <span className="font-semibold">{item.alamat_pengiriman}</span>
          </p>
        )}
        <p>
          Tipe pengiriman:{" "}
          <span className="font-semibold">
            <Badge variant="outline">{item.tipe_pengiriman}</Badge>
          </span>
        </p>
        <p>
          Total item: <span className="font-semibold">{item.total_item}</span>
        </p>
        <p>
          Total harga: <span className="font-semibold">{item.total_harga}</span>
        </p>
      </div>
      <div className="flex justify-between">
        {/* <Button
          onClick={handleUpdateStatus}
          disabled={isUpdating || item.status_pesanan === "selesai"}
        >
          {isUpdating ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            "Pesanan Sudah Diterima"
          )}
        </Button> */}
        <KonfirmasiBtn
          variant="default"
          handleClick={() => handleUpdateStatus()}
          title="Yes"
          disabled={isUpdating || item.status_pesanan === "selesai"}
        />
      </div>
    </div>
  );
};

type KonfirmasiBtnProps = {
    handleClick: () => void;
    title: string;
    variant: "destructive" | "default";
    disabled: boolean;
  };
  
  const KonfirmasiBtn = ({ handleClick, title, variant, disabled }: KonfirmasiBtnProps) => {
    const [isLoading, setIsLoading] = useState(false);
  
    const handleClickWithLoading = async () => {
      setIsLoading(true);
      await handleClick();
      setIsLoading(false);
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={variant} disabled={disabled || isLoading}>
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Pesanan Diterima"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Pesanan Anda Sudah Sampai?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClickWithLoading}>
              {isLoading ? <ClipLoader size={20} color="#ffffff" /> : title}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  

export default KonfirmasiPesanan;
