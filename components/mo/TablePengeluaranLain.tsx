import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tablePengeluaranLain } from "@/constants/mapping";
import { PENGELUARAN_LAIN } from "@/types";
import DeleteBtn from "../admin/DeleteBtn";
import NotFound from "../shared/NotFound";
import CreateEditPengeluaranLain from "./CreateEditPengeluaranLain";
import { formatTanggal } from "@/lib/utils";

interface Props {
  data: PENGELUARAN_LAIN[];
  refreshData: () => void;
  deleteData: (id: number) => void;
}

const TablePengeluaranLain = ({ data, refreshData, deleteData }: Props) => {
  if (data.length === 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tablePengeluaranLain.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: PENGELUARAN_LAIN) => (
          <TableRow key={item.ID_PENGELUARAN_LAIN}>
            <TableCell>{item.ID_PENGELUARAN_LAIN}</TableCell>
            <TableCell>{item.NAMA_PENGELUARAN}</TableCell>
            <TableCell>Rp. {item.BIAYA_PENGELUARAN}</TableCell>
            <TableCell>
              {formatTanggal(String(item.TANGGAL_PENGELUARAN))}
            </TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditPengeluaranLain
                data={item}
                refreshData={refreshData}
              />
              <DeleteBtn id={item.ID_PENGELUARAN_LAIN} hapusData={deleteData} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePengeluaranLain;
