import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableBonusKaryawan } from "@/constants/mapping";
import { BONUS_KARYAWAN } from "@/types";
import DeleteBtn from "../admin/DeleteBtn";
import NotFound from "../shared/NotFound";
import { formatTanggal } from "@/lib/utils";
//   import EditGajiKaryawan from "./EditGajiKaryawan";
import CreateEditBonusKaryawan from "./CreateEditBonusKaryawan";

interface Props {
  data: BONUS_KARYAWAN[];
  refreshData: () => void;
  deleteData: (id: number) => void;
}
const TableKaryawan = ({ data, refreshData, deleteData }: Props) => {
  if (data.length === 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableBonusKaryawan.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: BONUS_KARYAWAN) => (
          <TableRow key={item.ID_BONUS}>
            <TableCell>{item.ID_BONUS}</TableCell>
            <TableCell>{item.NAMA_KARYAWAN}</TableCell>
            {/* <TableCell>{item.TANGGAL_PEMBERIAN.split("T")[0]}</TableCell> */}
            <TableCell>
              {formatTanggal(String(item.TANGGAL_PEMBERIAN))}
            </TableCell>
            <TableCell>{item.BONUS}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditBonusKaryawan data={item} refreshData={refreshData} />
              <DeleteBtn id={item.ID_BONUS} hapusData={deleteData} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableKaryawan;
