"use client";
import { createPenitipSchema } from "@/app/validation";
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
import { PENITIP } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";
import { Textarea } from "../ui/textarea";

interface Props {
  data?: PENITIP;
  refreshData: () => void;
}

const CreateEditPenitip = ({ data, refreshData }: Props) => {
  const form = useForm<z.infer<typeof createPenitipSchema>>({
    resolver: zodResolver(createPenitipSchema),
    defaultValues: {
      nama_penitip: data?.NAMA_PENITIP || "",
      email_penitip: data?.EMAIL_PENITIP || "",
      no_telp_penitip: data?.NO_TELP_PENITIP || "",
      alamat_penitip: data?.ALAMAT_PENITIP || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createPenitipSchema>) {
    try {
      setIsLoading(true);

      const { nama_penitip, email_penitip, no_telp_penitip, alamat_penitip } =
        values;

      if (data) {
        const response = await axios.put(
          `/api/penitip/${data.ID_PENITIP_PRODUK}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nama_penitip,
              email_penitip,
              no_telp_penitip,
              alamat_penitip,
            }),
          }
        );

        if (response.data.status !== 200) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasi mengubah data penitip");
      } else {
        const response = await axios.post("/api/penitip", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_penitip,
            email_penitip,
            no_telp_penitip,
            alamat_penitip,
          }),
        });

        if (response.data.status !== 200) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasil menambah data penitip");
      }

      if (closeBtn.current) {
        form.reset();
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    form.reset({
      nama_penitip: data?.NAMA_PENITIP || "",
      email_penitip: data?.EMAIL_PENITIP || "",
      no_telp_penitip: data?.NO_TELP_PENITIP || "",
      alamat_penitip: data?.ALAMAT_PENITIP || "",
    });
  },[data])

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
          <DialogTitle className="text-center">Penitip</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama_penitip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penitip</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email_penitip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Penitip</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_telp_penitip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Telp Penitip</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat_penitip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Penitip</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
              {isLoading ? <Spinner /> : data ? "Edit Penitip" : "Tambah"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditPenitip;
