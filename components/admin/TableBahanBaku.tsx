import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bahanBakuTable } from "@/constants/mapping";
import { BAHAN_BAKU } from "@/types";
import CreateEditBahanBaku from "./CreateEditBahanBaku";
import DeleteBtn from "./DeleteBtn";

interface Props {
  data: BAHAN_BAKU[];
  refreshData: () => void;
  deleteData: (id: number) => void;
}
const TableBahanBaku = ({ data, refreshData, deleteData }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {bahanBakuTable.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        
        {data.map((item: BAHAN_BAKU) => (
          <TableRow key={item.ID_BAHAN}>
            <TableCell>{item.ID_BAHAN}</TableCell>
            <TableCell>{item.NAMA_BAHAN}</TableCell>
            <TableCell>Rp. {item.HARGA_BAHAN}</TableCell>
            <TableCell>{item.STOK_BAHAN}</TableCell>
            <TableCell>
              <Badge variant="secondary">{item.SATUAN}</Badge>
            </TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditBahanBaku data={item} refreshData={refreshData} />
              <DeleteBtn hapusData={deleteData} id={item.ID_BAHAN}  />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableBahanBaku;
