import { Button } from "@/components/ui/button";
import CreateEditDetailResep from "./CreateEditDetailResep";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { detailResepTable } from "@/constants/mapping";
import { DETAIL_RESEP } from "@/types";
import DeleteBtn from "./DeleteBtn";
import NotFound from "../shared/NotFound";

interface Props {
  data: DETAIL_RESEP[];
  refreshData: () => void;
  deleteData: (id: number) => void;
  id: string
}

const TableDetailResep = ({ data, refreshData, deleteData, id }: Props) => {
  if (data.length <= 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {detailResepTable.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: DETAIL_RESEP) => (
          <TableRow key={item.ID_RELASI_BAHAN_RESEP}>
            <TableCell>{item.ID_RELASI_BAHAN_RESEP}</TableCell>
            <TableCell>{item.NAMA_BAHAN}</TableCell>
            {/* <TableCell>{item.STOK_TERSEDIA}</TableCell> */}
            <TableCell>{item.JUMLAH_DIBUTUHKAN}</TableCell>
            <TableCell>{item.SATUAN}</TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditDetailResep id={id} data={item} refreshData={refreshData} />
              <DeleteBtn hapusData={deleteData} id={item.ID_RELASI_BAHAN_RESEP} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableDetailResep;
