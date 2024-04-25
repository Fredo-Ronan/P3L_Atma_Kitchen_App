import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { tableDetilTransaksi } from "@/constants/mapping";
import { DetilTransaksiHistori } from "@/types";
import NotFound from "../shared/NotFound";

interface Props {
  data: DetilTransaksiHistori[];
}

const TableDetilTransaksi = ({ data }: Props) => {
  if (data.length === 0) {
    return <NotFound />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableDetilTransaksi.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: DetilTransaksiHistori) => (
          <TableRow key={item.ID_DETIL_TRANSAKSI}>
            <TableCell>{item.ID_DETIL_TRANSAKSI}</TableCell>
            <TableCell>{item.NAMA_PRODUK}</TableCell>
            <TableCell>{item.HAMPERS}</TableCell>
            <TableCell>{item.JUMLAH_PESANAN}</TableCell>
            <TableCell>Rp. {item.SUBTOTAL}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableDetilTransaksi;
