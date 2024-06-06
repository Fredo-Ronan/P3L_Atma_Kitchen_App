import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";
import { pesananBatalTable } from "@/constants/mapping";
import { PESANAN } from "@/types";
import NotFound from "../shared/NotFound";
import { formatTanggal } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface Props {
  data: PESANAN[];
  refreshData: () => void;
}

const TablePesananBatal = ({ data, refreshData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (id: number) => {
    try {
      setIsLoading(true);
      await axios.post(`/api/pesananBatal/${id}`);
      toast.success("Berhasil Update Status Pesanan");
      refreshData();
    } catch (error) {
      console.log(error);
      toast.error("Gagal Update Status Pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  if (data.length <= 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {pesananBatalTable.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: PESANAN) => (
          <TableRow key={item.ID_TRANSAKSI_PESANAN}>
            <TableCell>{item.ID_TRANSAKSI_PESANAN}</TableCell>
            <TableCell>{item.NAMA_CUSTOMER}</TableCell>
            <TableCell>{item.TIPE_PENGIRIMAN}</TableCell>
            <TableCell>{item.TOTAL_ITEM}</TableCell>
            <TableCell>Rp. {item.TOTAL_HARGA}</TableCell>
            <TableCell>{item.STATUS_TRANSAKSI}</TableCell>
            <TableCell>{formatTanggal(String(item.TANGGAL_PENGIRIMAN))}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              {/* <button
                onClick={() => handleDelete(item.ID_TRANSAKSI_PESANAN)}
                className="bg-red-500 text-white px-3 py-1 rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Delete'}
              </button> */}
              {item.STATUS_TRANSAKSI === "checkout, belum bayar"&& (
                  <KonfirmasiBtn
                    handleClick={() =>
                      handleSubmit(item.ID_TRANSAKSI_PESANAN)
                    }
                    title="Batalkan Pesanan"
                    variant="default"
                    disabled={isLoading}
                  />
                )}
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
  disabled: boolean;
};

const KonfirmasiBtn = ({
  handleClick,
  title,
  variant,
  disabled,
}: KonfirmasiBtnProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClickWithLoading = async () => {
    setIsLoading(true);
    await handleClick();
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} disabled={disabled || isLoading} className="bg-red-500 text-white hover:bg-red-700">
          {isLoading ? <ClipLoader size={20} color="#ffffff" /> : title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Ingin Membatalkan Transaksi Pesanan INI?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClickWithLoading} className="bg-red-500 text-white hover:bg-red-700"> 
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : title}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TablePesananBatal;
