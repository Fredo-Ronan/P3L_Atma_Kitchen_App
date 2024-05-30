// import { Button } from "@/components/ui/button";
import EditPengiriman from "./EditPengiriman";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pengirimanTable } from "@/constants/mapping";
import { PENGIRIMAN } from "@/types";
import NotFound from "../shared/NotFound";

interface Props {
  data: PENGIRIMAN[];
  refreshData: () => void;
}

const TablePengiriman = ({ data, refreshData}: Props) => {
  if (data.length <= 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {pengirimanTable.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: PENGIRIMAN) => (
          <TableRow key={item.ID_TRANSAKSI_PESANAN}>
            <TableCell>{item.ID_TRANSAKSI_PESANAN}</TableCell>
            <TableCell>{item.NAMA_CUSTOMER}</TableCell>
            <TableCell>{item.ALAMAT_PENGIRIMAN}</TableCell>
            <TableCell>{item.JARAK}</TableCell>
            <TableCell>Rp. {item.ONGKIR}</TableCell>
            <TableCell>Rp. {item.TOTAL_HARUS_DIBAYAR}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <EditPengiriman data={item} refreshData={refreshData} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePengiriman;
