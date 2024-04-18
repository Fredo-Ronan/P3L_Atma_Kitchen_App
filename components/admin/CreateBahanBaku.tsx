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
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";

const CreateBahanBaku = () => {
  const form = useForm<z.infer<typeof createBahanBakuSchma>>({
    resolver: zodResolver(createBahanBakuSchma),
    defaultValues: {
      nama_bahan: "",
      harga_bahan: "",
      stok_bahan: "",
      satuan: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createBahanBakuSchma>) {
    try {
      setIsLoading(true);

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

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        form.reset();
      }
    } catch (error) {
      toast.error("Gagal menambahkan bahan baku");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger className="py-2.5 px-6 bg-blue-500 rounded shadow text-white">
        Tambah
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
                    <Select onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Satuan" />
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
              className="bg-blue-500 hover:bg-blue-500/70"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Submit"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBahanBaku;
