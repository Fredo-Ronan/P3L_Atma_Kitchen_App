"use client";
import LaporanPenitipPDF from "@/components/LaporanPenitipPDF";
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
import saveAs from "file-saver";
import { useEffect, useState } from "react";
const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState({});
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchData = async (queryParams: any) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/laporanPenitip", {
        params: queryParams,
      });
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

  const handleCetak = async () => {
    const blob = await pdf(
      <LaporanPenitipPDF data={data} month={month} />
    ).toBlob();
    saveAs(blob, "example.pdf");
  };

  useEffect(() => {
    let queryParams = {
      date: new Date().toISOString().slice(0, 7),
    };
    fetchData(queryParams);
  }, []);

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
      <div className="mt-8 gap-20">
        {Object.keys(data).map((key: any, index: number) => (
          <div key={index} className="flex flex-col gap-4">
            <h3 className="text-lg font-bold mt-4">{key}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama </TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Harga Jual</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>20% Komisi</TableHead>
                  <TableHead>Yang diterima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data[key].map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.NAMA_PRODUK}</TableCell>
                    <TableCell>{item.QTY}</TableCell>
                    <TableCell>Rp. {item.HARGA_PRODUK}</TableCell>
                    <TableCell>Rp. {item.TOTAL}</TableCell>
                    <TableCell>Rp. {item.KOMISI}</TableCell>
                    <TableCell>Rp. {item.PENGHASILAN}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total</TableCell>
                  <TableCell>
                    Rp.{" "}
                    {data[key].reduce(
                      (acc: any, item: any) => acc + item.PENGHASILAN,
                      0
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Page;
