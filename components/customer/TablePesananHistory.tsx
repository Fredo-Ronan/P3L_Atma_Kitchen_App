import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { tablePesananHistori } from "@/constants/mapping";
  import { formatTanggal } from "@/lib/utils";
  import { PesananHistori } from "@/types";
  import Link from "next/link";
  import NotFound from "../shared/NotFound";
  
  interface Props {
    data: PesananHistori[];
    id: string;
  }
  
  const TablePesananHistori = ({ data, id }: Props) => {
    if (data.length === 0) {
      return <NotFound />;
    }
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {tablePesananHistori.map((item: string) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
            <TableHead>Detail Transaksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: PesananHistori) => (
            <TableRow key={item.ID_TRANSAKSI_PESANAN}>
              <TableCell>{item.ID_TRANSAKSI_PESANAN}</TableCell>
              <TableCell>{item.TOTAL_ITEM}</TableCell>
              <TableCell>{formatTanggal(String(item.TANGGAL_PESANAN))}</TableCell>
              <TableCell>{item.STATUS_TRANSAKSI}</TableCell>
              <TableCell>{item.STATUS_PESANAN}</TableCell>
              <TableCell>{item.ALAMAT_PENGIRIMAN}</TableCell>
              <TableCell>{item.TIPE_PENGIRIMAN}</TableCell>
              <TableCell>
                {formatTanggal(String(item.TANGGAL_PENGIRIMAN))}
              </TableCell>
              <TableCell>
                <Link
                  href={`/customerView/historyCustomer/${id}/${item.ID_TRANSAKSI_PESANAN}`}
                  className="text-blue-500"
                >
                  Lihat Detail
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default TablePesananHistori;
  