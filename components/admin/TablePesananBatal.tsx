import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pesananBatalTable } from "@/constants/mapping";
import {PESANAN } from "@/types";
import NotFound from "../shared/NotFound";
import { formatTanggal } from "@/lib/utils";

interface Props {
  data: PESANAN[];
  refreshData: () => void;
}

const TablePesananBatal = ({ data, refreshData}: Props) => {
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
              {/* <EditPengiriman data={item} refreshData={refreshData} /> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePesananBatal;
