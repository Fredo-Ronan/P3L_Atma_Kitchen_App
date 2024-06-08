"use client";
import LaporanKaryawanPDF from "@/components/LaporanKaryawanPDF";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonths } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchData = async (queryParams: any) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/presensiGaji/1", { params: queryParams });
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (value: string) => {
    if (value !== "Pilih bulan") {
      let queryParams = {
        date: value,
      };
      setMonth(value);
      fetchData(queryParams);
    }
  };

  useEffect(() => {
    let queryParams = {
      date: new Date().toISOString().slice(0, 7),
    };
    fetchData(queryParams);
  }, []);

  const handleCetak = async () => {
    const blob = await pdf(<LaporanKaryawanPDF data={data} month={month}/>).toBlob();
    saveAs(blob, "example.pdf");
  };

  if (loading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="p-5 flex flex-col ">
      <h2 className="text-xl font-bold">
        Laporan presensi dan gaji pegawai bulanan
      </h2>
      <div className="mt-4">
        <Select
          onValueChange={(value) => handleSelectChange(value)}
          defaultValue={month}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue>{month}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {getMonths().map((month: any) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm font-bold mt-4">
        Data diperbarui pada {new Date().toISOString().slice(0, 10)}
      </p>
      <Button onClick={handleCetak} className="w-fit my-4">
        Cetak PDF
      </Button>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Jumlah Hadir</TableHead>
              <TableHead>Jumlah Bolos</TableHead>
              <TableHead>Honor Harian</TableHead>
              <TableHead>Bonus Rajin</TableHead>
              <TableHead>Total </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, index) => (
              <TableRow key={index}>
                <TableCell>{item.namaKaryawan}</TableCell>
                <TableCell>{item.jumlahHadir}</TableCell>
                <TableCell>{item.jumlahBolos}</TableCell>
                <TableCell>Rp. {item.honorHarian}</TableCell>
                <TableCell>Rp. {item.bonusRajin}</TableCell>
                <TableCell>Rp. {item.totalGaji}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell>
                Rp.{" "}
                {data.reduce((acc: any, curr: any) => acc + curr.totalGaji, 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default Page;
