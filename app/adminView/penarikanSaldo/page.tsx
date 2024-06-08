"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [data, setData]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/saldo");
      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (id: string) => {
    setLoading(true);
    try {
      await axios.put(`/api/saldo/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Penarikan Saldo</h1>
      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>JUMLAH SALDO DITARIK</TableHead>
            <TableHead>TANGGAL</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: any) => (
            <TableRow key={item.ID_PENARIKAN_SALDO}>
              <TableCell>{item.JUMLAH_SALDO_DITARIK}</TableCell>
              <TableCell>{item.TANGGAL_PENARIKAN}</TableCell>
              <TableCell>{item.STATUS}</TableCell>
              <TableCell>
                {" "}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="mt-3 w-fit">Konfirmasi</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Apakah kamu yakin ingin mengkonfirmasi saldo ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Saldo akan ditransfer ke rekening yang terdaftar
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSubmit(item.ID_PENARIKAN_SALDO)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
