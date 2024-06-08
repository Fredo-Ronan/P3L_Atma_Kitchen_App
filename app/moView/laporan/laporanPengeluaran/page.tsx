"use client";
import LaporanCashflowPDF from "@/components/LaporanCashflowPDF";
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
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState({});
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchData = async (queryParams: any) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/cashflow/1", { params: queryParams });
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
    const blob = await pdf(
      <LaporanCashflowPDF data={data} month={month} />
    ).toBlob();
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
        Laporan Pemasukan dan Pengeluaran Bulanan
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
        Cetak
      </Button>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Pemasukan</TableHead>
              <TableHead>Pengeluaran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Penjualan</TableCell>
              <TableCell>Rp. {data.pemasukan}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tip</TableCell>
              <TableCell>Rp. {data.tip}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gaji Karyawan</TableCell>
              <TableCell></TableCell>
              <TableCell>Rp. {data.gajiKaryawan}</TableCell>
            </TableRow>

            {data?.pengeluaranLain?.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.NAMA_PENGELUARAN}</TableCell>
                <TableCell></TableCell>
                <TableCell>Rp. {item.BIAYA_PENGELUARAN}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                Rp. {Number(data.pemasukan) + Number(data.tip)}
              </TableCell>
              <TableCell>
                Rp.{" "}
                {data.gajiKaryawan +
                  data?.pengeluaranLain?.reduce(
                    (acc: number, current: any) =>
                      acc + Number(current.BIAYA_PENGELUARAN),
                    0
                  )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
export default Page;
