"use client";
import { createResepSchma } from "@/app/validation";
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
import { satuanFilter } from "@/constants/mapping";
import { cn } from "@/lib/utils";
import { RESEP } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";

interface Props {
  data?: RESEP;
  refreshData: () => void;
}

const CreateEditResep = ({ data, refreshData }: Props) => {

  useEffect(() => {
    form.reset({
        nama_resep: data?.NAMA_RESEP || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof createResepSchma>>({
    resolver: zodResolver(createResepSchma),
    defaultValues: {
        nama_resep: data?.NAMA_RESEP || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createResepSchma>) {
    try {
      setIsLoading(true);

      if (data) {
        const response = await axios.put(`/api/resep/${data.ID_RESEP}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_resep: values.nama_resep,
          }),
        });

        if (response.status !== 200) {
          throw new Error("Gagal mengubah resep");
        }

        toast.success("Berhasil mengubah resep");
      } else {
        const response = await axios.post("/api/resep", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_resep: values.nama_resep,
          }),
        });

        if (response.status !== 201) {
          throw new Error("Failed to create resep");
        }

        toast.success("Berhasil menambahkan resep");
      }

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal menambahkan resep");
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
          <DialogTitle className="text-center">Resep</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama_resep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Resep</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              {isLoading ? <Spinner /> : data ? "Edit Resep" : "Tambah Resep"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditResep;
