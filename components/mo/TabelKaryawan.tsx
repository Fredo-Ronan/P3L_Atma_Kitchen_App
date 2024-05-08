import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tabelKaryawan } from "@/constants/mapping";
import { KARYAWAN } from "@/types";
import DeleteBtn from "../admin/DeleteBtn";
import NotFound from "../shared/NotFound";
import CreateEditKaryawan from "./CreateEditKaryawan";

interface Props {
  data: KARYAWAN[];
  refreshData: () => void;
  deleteData: (id: number) => void;
}
const TableKaryawan = ({ data, refreshData, deleteData }: Props) => {
  if (data.length === 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tabelKaryawan.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: KARYAWAN) => (
          <TableRow key={item.ID_KARYAWAN}>
            <TableCell>{item.ID_KARYAWAN}</TableCell>
            <TableCell>{item.NAMA_KARYAWAN}</TableCell>
            <TableCell>{item.EMAIL_KARYAWAN}</TableCell>
            <TableCell>{item.ALAMAT_KARYAWAN}</TableCell>
            <TableCell>{item.NO_TELP_KARYAWAN}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditKaryawan data={item} refreshData={refreshData} />
              <DeleteBtn id={item.ID_KARYAWAN} hapusData={deleteData} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableKaryawan;
