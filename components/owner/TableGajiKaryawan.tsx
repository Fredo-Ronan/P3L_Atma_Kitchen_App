import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { tableGajiKaryawan } from "@/constants/mapping";
  import { GAJI_KARYAWAN } from "@/types";
//   import DeleteBtn from "../admin/DeleteBtn";
  import NotFound from "../shared/NotFound";
  import EditGajiKaryawan from "./EditGajiKaryawan";
  
  interface Props {
    data: GAJI_KARYAWAN[];
    refreshData: () => void;
    // deleteData: (id: number) => void;
  }
  const TableKaryawan = ({ data, refreshData }: Props) => {
    if (data.length === 0) return <NotFound />;
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {tableGajiKaryawan.map((item: string) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: GAJI_KARYAWAN) => (
            <TableRow key={item.ID_ROLE}>
              <TableCell>{item.ID_ROLE}</TableCell>
              <TableCell>{item.NAMA_ROLE}</TableCell>
              <TableCell>{item.NOMINAL_GAJI}</TableCell>
              <TableCell className="flex items-center gap-3 justify-center">
                <EditGajiKaryawan data={item} refreshData={refreshData} />
                {/* <DeleteBtn id={item.ID_KARYAWAN} hapusData={deleteData} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default TableKaryawan;
  