"use client";
import { createEditHampersSchema } from "@/app/validation";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HAMPERS, PRODUK } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

interface Props {
  data?: HAMPERS;
  dataProduk?: PRODUK[];
  produkSudahTerpilih?: PRODUK[];
  refreshData: () => void;
}

const EditHampersOnly = ({
  data,
  refreshData,
}: Props) => {

  useEffect(() => {
    form.reset({
      nama_hampers: data?.NAMA_HAMPERS || "",
      deskripsi_hampers: data?.DESKRIPSI_HAMPERS || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof createEditHampersSchema>>({
    resolver: zodResolver(createEditHampersSchema),
    defaultValues: {
      nama_hampers: data?.NAMA_HAMPERS || "",
      deskripsi_hampers: data?.DESKRIPSI_HAMPERS || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createEditHampersSchema>) {
    try {
      setIsLoading(true);

      const idHampers = data?.ID_HAMPERS;

        const resUpdateHampers = await axios.put(`/api/hampers/${idHampers}`, {
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            nama_hampers: values.nama_hampers,
            harga_hampers: data?.HARGA_HAMPERS,
            deskripsi_hampers: data?.DESKRIPSI_HAMPERS.includes("+ Exclusive box and Card") && !values.deskripsi_hampers.includes("+ Exclusive box and Card") ? values.deskripsi_hampers + " + Exclusive box and Card" : values.deskripsi_hampers
            }),
        });
        toast.success("Berhasil mengubah detil hampers");

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal mengubah hampers");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  //   console.log(data?.GAMBAR_PRODUK)

  return (
    <Dialog>
      <DialogTrigger
        className={cn(`bg-blue-500 rounded shadow text-white`, {
          "py-2.5 px-6 hover:bg-blue-500/50": !data,
          "py-2.5 px-6 bg-orange-500 hover:bg-orange-500/50": data,
        })}
        onClick={() => {
          form.reset();
        }}
      >
        {data ? "Edit" : "Tambah"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Hampers</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="nama_hampers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Hampers</FormLabel>
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deskripsi_hampers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Hampers</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className={cn({
                "bg-blue-500 hover:bg-blue-500/50": !data,
                "bg-orange-500 hover:bg-orange-500/50": data,
              })}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : data ? "Edit Hampers" : "Tambah"}
            </Button>
            <DialogClose hidden ref={closeBtn} onClick={refreshData} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHampersOnly;
