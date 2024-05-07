import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { BAHAN_BAKU, PENGADAAN_BAHAN } from "@/types";
  import DeleteBtn from "../admin/DeleteBtn";
  import NotFound from "../shared/NotFound";
import CreateEditPengadaanBahan from "./CreateEditPengadaanBahan";
  
  interface Props {
    data: PENGADAAN_BAHAN[];
    dataBahan: BAHAN_BAKU[];
    refreshData: () => void;
    deleteData: (id: number) => void;
  }
  
  const TablePengadaanBahan = ({ data, dataBahan, refreshData, deleteData }: Props) => {
    if (data?.length === 0) return <NotFound />;
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
              <TableHead>Nama Bahan</TableHead>
              <TableHead>Harga Bahan</TableHead>
              <TableHead>Tanggal Beli</TableHead>
              <TableHead>Jumlah Beli</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: PENGADAAN_BAHAN) => (
            <TableRow key={item.ID_PENGADAAN_BAHAN}>
              <TableCell>{item.NAMA_BAHAN}</TableCell>
              <TableCell>Rp. {item.HARGA_BELI_BAHAN}</TableCell>
              <TableCell>{item.TANGGAL_BELI.split("T")[0]}</TableCell>
              <TableCell>{item.JUMLAH_BELI}</TableCell>
              <TableCell className="flex items-center gap-3 justify-center">
                <CreateEditPengadaanBahan data={item} dataBahan={dataBahan} refreshData={refreshData}/>
                <DeleteBtn id={item.ID_PENGADAAN_BAHAN} hapusData={deleteData} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  export default TablePengadaanBahan;
  