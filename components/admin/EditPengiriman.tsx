"use client";
import { editPengirimanSchema } from "@/app/validation";
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
import { PENGIRIMAN } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";

interface Props {
  data?: PENGIRIMAN;
  refreshData: () => void;
}

const EditPengiriman = ({ data, refreshData }: Props) => {
  useEffect(() => {
    form.reset({
      jarak: data?.JARAK?.toString() || "",
      // ongkir: data?.ONGKIR?.toString() || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof editPengirimanSchema>>({
    resolver: zodResolver(editPengirimanSchema),
    defaultValues: {
      jarak: data?.JARAK?.toString() || "",
      // ongkir: data?.ONGKIR?.toString() || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof editPengirimanSchema>) {
    try {
      setIsLoading(true);

      if (data) {
        const response = await axios.put(
          `/api/pengiriman/${data.ID_TRANSAKSI_PESANAN}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jarak: values.jarak,
              // ongkir: values.ongkir,
            }),
          }
        );

        if (response.status !== 200) {
          throw new Error("Gagal Menambahkan Jarak dan Ongkir");
        }

        toast.success("Berhasil Menambahkan Jarak dan Ongkir");
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
        })}
        onClick={() => form.reset()}
      >
        {"Tambah"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Pengiriman</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="jarak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jarak</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="ongkir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ongkos Kirim</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Button
              type="submit"
              className={cn({
                "bg-blue-500 hover:bg-blue-500/50": !data,
                "bg-orange-500 hover:bg-orange-500/50": data,
              })}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Tambah"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPengiriman;
