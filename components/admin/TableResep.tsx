import { Button } from "@/components/ui/button";
import CreateEditResep from "./CreateEditResep";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resepTable } from "@/constants/mapping";
import { RESEP } from "@/types";
import DeleteBtn from "./DeleteBtn";
import NotFound from "../shared/NotFound";
import Link from "next/link";

interface Props {
  data: RESEP[];
  refreshData: () => void;
  deleteData: (id: number) => void;
}

const TableResep = ({ data, refreshData, deleteData }: Props) => {
  if (data.length <= 0) return <NotFound />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {resepTable.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: RESEP) => (
          <TableRow key={item.ID_RESEP}>
            <TableCell>{item.ID_RESEP}</TableCell>
            <TableCell>{item.NAMA_RESEP}</TableCell>
            <TableCell>
              {/* <Button asChild> */}
                <Link href={`/adminView/resep/${item.ID_RESEP}`} className='underline text-blue-500'>
                  Detail Resep
                </Link>
              {/* </Button> */}
            </TableCell>
            <TableCell className="flex items-center gap-3 justify-center">
              <CreateEditResep data={item} refreshData={refreshData} />
              <DeleteBtn hapusData={deleteData} id={item.ID_RESEP} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableResep;
