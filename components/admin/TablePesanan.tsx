import { Button } from "@/components/ui/button";
import EditPengiriman from "./EditPengiriman";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pesananTable } from "@/constants/mapping";
import { PESANAN } from "@/types";
import NotFound from "../shared/NotFound";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
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
  data: PESANAN[];
  refreshData: () => void;
}

const TablePesanan = ({ data, refreshData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  if (data.length <= 0) return <NotFound />;

  const updatePesananPickUp = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `/api/pesananPickUp/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Gagal Update Status Pesanan");
      }

      toast.success("Berhasil Update Status Pesanan");

      if (closeBtn.current) {
        closeBtn.current.click();
      }
      refreshData();
    } catch (error) {
      toast.error("Pesanan Siap Diambil");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePesananSelesai = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `/api/pesananPickUp/pesananSelesai/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Gagal Update Status Pesanan");
      }

      toast.success("Pesanan Sudah Diambil");

      if (closeBtn.current) {
        closeBtn.current.click();
      }
      refreshData();
    } catch (error) {
      toast.error("Gagal Update Status Pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePesananDelivery = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `/api/pesananDelivery/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Gagal Update Status Pesanan");
      }

      toast.success("Pesanan Siap Dikirim");

      if (closeBtn.current) {
        closeBtn.current.click();
      }
      refreshData();
    } catch (error) {
      toast.error("Gagal Update Status Pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePesananDikirim = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `/api/pesananDelivery/pesananDikirim/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Gagal Update Status Pesanan");
      }

      toast.success("Pesanan Dikirim Kurir");

      if (closeBtn.current) {
        closeBtn.current.click();
      }
      refreshData();
    } catch (error) {
      toast.error("Gagal Update Status Pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (id: string, tipePengiriman: string) => {
    if (tipePengiriman === "delivery") {
      updatePesananDelivery(id);
    } else {
      updatePesananPickUp(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {pesananTable.map((item: string) => (
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
            <TableCell>{item.TOTAL_ITEM}</TableCell>
            <TableCell>Rp. {item.TOTAL_HARGA}</TableCell>
            <TableCell>{item.STATUS_PESANAN}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              {item.STATUS_PESANAN === "pesanan diproses" && (
                <KonfirmasiBtn
                  handleClick={() =>
                    handleUpdate(
                      item.ID_TRANSAKSI_PESANAN.toString(),
                      item.TIPE_PENGIRIMAN
                    )
                  }
                  title="Update Status"
                  variant="default"
                  disabled={isLoading}
                />
              )}

              {item.STATUS_PESANAN === "pesanan siap diambil" &&
                item.TIPE_PENGIRIMAN === "pickup" && (
                  <KonfirmasiBtn
                    handleClick={() =>
                      updatePesananSelesai(item.ID_TRANSAKSI_PESANAN.toString())
                    }
                    title="Selesai"
                    variant="default"
                    disabled={isLoading}
                  />
                )}

              {item.STATUS_PESANAN === "pesanan siap dikirim" &&
                item.TIPE_PENGIRIMAN === "delivery" && (
                  <KonfirmasiBtn
                    handleClick={() =>
                      updatePesananDikirim(item.ID_TRANSAKSI_PESANAN.toString())
                    }
                    title="Kirim Pesanan"
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
        <Button variant={variant} disabled={disabled || isLoading}>
          {isLoading ? <ClipLoader size={20} color="#ffffff" /> : title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Ingin Mengubah Status Pesanan?
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

export default TablePesanan;
