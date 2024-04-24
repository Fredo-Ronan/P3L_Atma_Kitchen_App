"use client";
import { createPengeluaranLainSchema } from "@/app/validation";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PENGELUARAN_LAIN } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";
import { Calendar } from "../ui/calendar";

interface Props {
  data?: PENGELUARAN_LAIN;
  refreshData: () => void;
}

const CreateEditPengeluaranLain = ({ data, refreshData }: Props) => {
  const form = useForm<z.infer<typeof createPengeluaranLainSchema>>({
    resolver: zodResolver(createPengeluaranLainSchema),
    defaultValues: {
      nama_pengeluaran: data?.NAMA_PENGELUARAN || "",
      biaya_pengeluaran: String(data?.BIAYA_PENGELUARAN) || "",
      tanggal_pengeluaran: data
        ? new Date(data.TANGGAL_PENGELUARAN)
        : new Date(),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createPengeluaranLainSchema>) {
    try {
      setIsLoading(true);

      const { nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran } =
        values;

      if (data) {
        // edit
        const response = await axios.put(
          `/api/pengeluaranLain/${data.ID_PENGELUARAN_LAIN}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nama_pengeluaran,
              biaya_pengeluaran,
              tanggal_pengeluaran,
            }),
          }
        );

        if (response.status !== 200) {
          throw new Error("Gagal mengubah pengeluaran lain");
        }

        toast.success("Berhasil mengubah pengeluaran lain");
      } else {
        const response = await axios.post("/api/pengeluaranLain", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_pengeluaran,
            biaya_pengeluaran,
            tanggal_pengeluaran,
          }),
        });

        if (response.data.status !== 201) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasil menambah data pengeluaran lain");
      }

      if (closeBtn.current && !isLoading) {
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
      nama_pengeluaran: data?.NAMA_PENGELUARAN || "",
      biaya_pengeluaran: String(data?.BIAYA_PENGELUARAN) || "",
      tanggal_pengeluaran: data
        ? new Date(data.TANGGAL_PENGELUARAN)
        : new Date(),
    });
  }, [data]);

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
          <DialogTitle className="text-center">Pengeluaran Lain</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama_pengeluaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pengeluaran Lain</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="biaya_pengeluaran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biaya Pengeluaran Lain</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue={new Date()}
              name="tanggal_pengeluaran"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pengeluaran Lain</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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

export default CreateEditPengeluaranLain;
