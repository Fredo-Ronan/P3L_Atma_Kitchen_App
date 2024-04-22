"use client";
import { createBahanBakuSchma } from "@/app/validation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { satuanFilter } from "@/constants/mapping";
import { cn } from "@/lib/utils";
import { BAHAN_BAKU } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";

interface Props {
  data?: BAHAN_BAKU;
  refreshData: () => void;
}

const CreateEditBahanBaku = ({ data, refreshData }: Props) => {

  useEffect(() => {
    form.reset({
      nama_bahan: data?.NAMA_BAHAN || "",
      harga_bahan: String(data?.HARGA_BAHAN) || "",
      stok_bahan: String(data?.STOK_BAHAN) || "",
      satuan: data?.SATUAN || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof createBahanBakuSchma>>({
    resolver: zodResolver(createBahanBakuSchma),
    defaultValues: {
      nama_bahan: data?.NAMA_BAHAN || "",
      harga_bahan: String(data?.HARGA_BAHAN) || "",
      stok_bahan: String(data?.STOK_BAHAN) || "",
      satuan: data?.SATUAN || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createBahanBakuSchma>) {
    try {
      setIsLoading(true);

      if (data) {
        const response = await axios.put(`/api/bahanBaku/${data.ID_BAHAN}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_bahan: values.nama_bahan,
            harga_bahan: Number(values.harga_bahan),
            stok_bahan: Number(values.stok_bahan),
            satuan: values.satuan,
          }),
        });

        if (response.status !== 200) {
          throw new Error("Gagal mengubah bahan baku");
        }

        toast.success("Berhasil mengubah bahan baku");
      } else {
        const response = await axios.post("/api/bahanBaku", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_bahan: values.nama_bahan,
            harga_bahan: Number(values.harga_bahan),
            stok_bahan: Number(values.stok_bahan),
            satuan: values.satuan,
          }),
        });

        

        if (response.status !== 201) {
          throw new Error("Failed to create bahan baku");
        }

        toast.success("Berhasil menambahkan bahan baku");
      }

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal menambahkan bahan baku");
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
        {data ? "Edit" : "Tambah"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Bahan Baku</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama_bahan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bahan Baku</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga_bahan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Bahan Baku</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stok_bahan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Bahan Baku</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={data?.SATUAN || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Satuan"
                          defaultValue={data?.SATUAN}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {satuanFilter.map((item: string) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              })}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : data ? "Edit Bahan" : "Tambah"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditBahanBaku;
