"use client";
import { editPembayaranSchema } from "@/app/validation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PEMBAYARAN } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";

interface Props {
  data?: PEMBAYARAN;
  refreshData: () => void;
  disabled?: boolean;
}

const EditPembayaran = ({ data, refreshData, disabled }: Props) => {
  useEffect(() => {
    form.reset({
      total_bayar_customer: data?.TOTAL_BAYAR_CUSTOMER?.toString() || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof editPembayaranSchema>>({
    resolver: zodResolver(editPembayaranSchema),
    defaultValues: {
      total_bayar_customer: data?.TOTAL_BAYAR_CUSTOMER?.toString() || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof editPembayaranSchema>) {
    try {
      setIsLoading(true);
      if (data) {
        const response = await axios.put(
          `/api/pembayaran/${data.ID_TRANSAKSI_PESANAN}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              total_bayar_customer: values.total_bayar_customer,
            }),
          }
        );

        if (response.status == 500) {
          throw new Error("Gagal Menambahkan Pembayaran");
        } else if (response.status == 400) {
          throw new Error("Uang Yang Anda Masukkan Kurang");
        }

        toast.success("Berhasil Menambahkan Pembayaran");
      }

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal Menambahkan Jarak dan Ongkir");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn(`bg-blue-500 rounded shadow text-white`, {
          "py-2.5 px-6 hover:bg-blue-500/50": !data,
          "py-1 px-3 bg-orange-500 hover:bg-orange-500/50": data,
          "cursor-not-allowed opacity-50": disabled,
        })}
        onClick={() => !disabled && form.reset()}
        disabled={disabled}
      >
        {"Pembayaran"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Pembayaran</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="total_bayar_customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pembayaran Customer</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={cn({
                "bg-blue-500 hover:bg-blue-500/50": !data,
                "bg-orange-500 hover:bg-orange-500/50": data,
                "cursor-not-allowed opacity-50": disabled,
              })}
              disabled={isLoading || disabled}
            >
              {isLoading ? <Spinner /> : "Bayar"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPembayaran;
