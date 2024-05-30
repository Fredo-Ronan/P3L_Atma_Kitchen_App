import { useState } from "react";
import EditPembayaran from "./EditPembayaran";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pembayaranTable } from "@/constants/mapping";
import { PEMBAYARAN } from "@/types";
import NotFound from "../shared/NotFound";

interface Props {
  data: PEMBAYARAN[];
  refreshData: () => void;
}

const TablePengiriman = ({ data, refreshData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  if (data.length <= 0) return <NotFound />;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {pembayaranTable.map((item: string) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: PEMBAYARAN) => (
            <TableRow key={item.ID_TRANSAKSI_PESANAN}>
              <TableCell>{item.ID_TRANSAKSI_PESANAN}</TableCell>
              <TableCell>{item.NAMA_CUSTOMER}</TableCell>
              <TableCell><Badge variant="secondary">{item.STATUS_TRANSAKSI}</Badge></TableCell>
              <TableCell>Rp. {item.TOTAL_HARGA}</TableCell>
              <TableCell>Rp. {item.TOTAL_BAYAR_CUSTOMER}</TableCell>
              <TableCell>Rp. {item.JUMLAH_TIP}</TableCell>
              <TableCell>
                <img
                  src={item.BUKTI_TF}
                  className="border-8 border-white w-32 h-32 object-cover cursor-pointer"
                  alt="Gambar Kosong!"
                  onClick={() => handleImageClick(item.BUKTI_TF)}
                />
              </TableCell>
              <TableCell className="flex items-center gap-3 justify-center">
                <EditPembayaran 
                  data={item} 
                  refreshData={refreshData}
                  totalHarga={parseInt(item.TOTAL_HARGA)}
                  disabled={item.STATUS_TRANSAKSI === 'checkout, pembayaran terkonfirmasi'} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
            <button
              className="absolute top-0 right-1 text-black text-xl"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              className="w-full h-auto"
              alt="Gambar Kosong!"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePengiriman;
