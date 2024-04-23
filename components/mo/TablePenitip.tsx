import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tablePenitip } from "@/constants/mapping";
import { PENITIP } from "@/types";
import CreateEditBahanBaku from "../admin/CreateEditBahanBaku";
import CreateEditPenitip from "./CreateEditPenitip";
import DeleteBtn from "../admin/DeleteBtn";
import NotFound from "../shared/NotFound";

interface Props {
  data: PENITIP[];
  refreshData: () => void;
  deleteData: (id: number) => void;
}
const TablePenitip = ({ data, refreshData, deleteData }: Props) => {
  
  if (data.length === 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tablePenitip.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: PENITIP) => (
          <TableRow key={item.ID_PENITIP_PRODUK}>
            <TableCell>{item.ID_PENITIP_PRODUK}</TableCell>
            <TableCell>{item.NAMA_PENITIP}</TableCell>
            <TableCell>{item.EMAIL_PENITIP}</TableCell>
            <TableCell>{item.NO_TELP_PENITIP}</TableCell>
            <TableCell>{item.ALAMAT_PENITIP}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditPenitip data={item} refreshData={refreshData} />
              <DeleteBtn id={item.ID_PENITIP_PRODUK} hapusData={deleteData} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePenitip;
