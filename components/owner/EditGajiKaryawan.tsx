"use client";
import { editGajiKaryawanSchema } from "@/app/validation";
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
import { GAJI_KARYAWAN } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";

interface Props {
  data?: GAJI_KARYAWAN ;
  refreshData: () => void;
}

const EditGajiKaryawan = ({ data,  refreshData }: Props) => {
  const form = useForm<z.infer<typeof editGajiKaryawanSchema>>({
    resolver: zodResolver(editGajiKaryawanSchema),
    defaultValues: {
      id_role: String(data?.ID_ROLE) || "",
      nama_role: data?.NAMA_ROLE || "",
      nominal_gaji: String(data?.NOMINAL_GAJI) || "",
      
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof editGajiKaryawanSchema>) {
    try {
      setIsLoading(true);

      const {
        id_role,
        nama_role,
        nominal_gaji,
      } = values;

      if (data) {
        const response = await axios.put(`/api/gajiKaryawan/${data.ID_ROLE}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_role,
            nama_role,
            nominal_gaji,
          }),
        });

        if (response.data.status !== 200) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasi Mengubah Gaji Karyawan");
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
      id_role: String(data?.ID_ROLE) || "",
      nama_role: data?.NAMA_ROLE || "",
      nominal_gaji: String(data?.NOMINAL_GAJI) || "",
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
          <DialogTitle className="text-center">Gaji Karyawan</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           
            <FormField
              control={form.control}
              name="nominal_gaji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nominal Gaji</FormLabel>
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
              {isLoading ? (
                <Spinner />
              ) :(
                "Edit Gaji Karyawan"
              )}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGajiKaryawan;
