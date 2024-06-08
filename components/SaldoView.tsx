"use client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./shared/Spinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
interface SaldoViewProps {
  data: string;
}

const SaldoView = ({ data }: SaldoViewProps) => {
  const [saldo, setSaldo] = useState<any>(0);
  const [loading, setLoading] = useState(false);
  const [histori, setHistori] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/saldo/${data}`);
        const res2 = await axios.get(`/api/historiSaldo/${data}`);
        setHistori(res2.data);
        const { SALDO } = res.data;
        setSaldo(SALDO);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/saldo/${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jumlahSaldo: saldo }),
      });

      if (res.data.status === "success") {
        toast({
          title: "Success",
          description: res.data.message,
        });
        setSaldo(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex-col flex mt-3 ">
      <h1 className="text-lg">
        Saldo anda sekarang saat ini: Rp.
        <span className="bg-green-600 text-white font-bold">{saldo}</span>
      </h1>
      {saldo !== 0 && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mt-3 w-fit">Tarik Saldo</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin ingin menarik saldomu?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Saldo akan ditransfer ke rekening yang terdaftar
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>JUMLAH SALDO DITARIK</TableHead>
              <TableHead>TANGGAL</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {histori.map((item) => (
              <TableRow key={item.ID_PENARIKAN_SALDO}>
                <TableCell>{item.JUMLAH_SALDO_DITARIK}</TableCell>
                <TableCell>{item.TANGGAL_PENARIKAN}</TableCell>
                <TableCell>{item.STATUS}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SaldoView;
