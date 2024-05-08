"use client";
import { createDetailResepSchma } from "@/app/validation";
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
import { DETAIL_RESEP } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";
import { BAHAN_BAKU } from "@/types";

interface Props {
  data?: DETAIL_RESEP;
  refreshData: () => void;
  id: string;
}

const CreateEditDetailResep = ({ data, refreshData, id }: Props) => {
  useEffect(() => {
    form.reset({
      id_bahan: data?.ID_BAHAN?.toString() || "",
      jumlah_dibutuhkan: data?.JUMLAH_DIBUTUHKAN || undefined,
      satuan: data?.SATUAN || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof createDetailResepSchma>>({
    resolver: zodResolver(createDetailResepSchma),
    defaultValues: {
      id_bahan: data?.ID_BAHAN?.toString() || "",
      jumlah_dibutuhkan: data?.JUMLAH_DIBUTUHKAN || undefined,
      satuan: data?.SATUAN || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createDetailResepSchma>) {
    try {
      setIsLoading(true);

      if (data) {
        const response = await axios.put(
          `/api/relasiBahanResep/${data.ID_RELASI_BAHAN_RESEP}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_resep: id,
              id_bahan: values.id_bahan,
              jumlah_dibutuhkan: values.jumlah_dibutuhkan,
              satuan: values.satuan,
            }),
          }
        );

        if (response.status !== 200) {
          throw new Error("Gagal Mengubah Detail Resep");
        }

        toast.success("Berhasil Mengubah Detail Resep");
      } else {
        const response = await axios.post("/api/relasiBahanResep", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_resep: id,
            id_bahan: values.id_bahan,
            jumlah_dibutuhkan: values.jumlah_dibutuhkan,
            satuan: values.satuan,
          }),
        });

        if (response.status !== 201) {
          throw new Error("Failed to create Detail Resep");
        }

        toast.success("Berhasil Menambahkan Detail Resep");
      }

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal Menambahkan Detail Resep");
    } finally {
      setIsLoading(false);
    }
  }

  const [bahanBaku, setBahanBaku] = useState<BAHAN_BAKU[]>([]);

  const fetchBahanBaku = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/relasiBahanResep/bahanBaku");
    setBahanBaku(res.data.data);
    console.log("Data Bahan Baku berhasil diambil:", res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBahanBaku();

    form.reset({
      id_bahan: data?.ID_BAHAN?.toString() || "",
      jumlah_dibutuhkan: data?.JUMLAH_DIBUTUHKAN || undefined,
      satuan: data?.SATUAN || "",
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
          <DialogTitle className="text-center">Detail Resep</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <Dropdown
              options={bahanBaku.map((bahan) => ({
                value: bahan.ID_BAHAN.toString(),
                label: bahan.NAMA_BAHAN,
              }))}
              onChange={(selectedOption) =>
                form.setValue("id_bahan", selectedOption.value)
              }
              placeholder="Pilih Bahan"
              className="cursor-pointer"
              controlClassName="p-2 w-full border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md cursor-pointer relative flex justify-between items-center"
              menuClassName="p-2 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-300 cursor-pointer overflow-auto max-h-60" // Tambahkan gaya CSS untuk discroll
              arrowClassName="text-gray-700"
              arrowClosed={<span className="text-gray-700">&#9660;</span>}
              arrowOpen={<span className="text-gray-700">&#9650;</span>}
            /> */}

            <FormField
              control={form.control}
              name="id_bahan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Bahan Baku</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={data?.ID_BAHAN?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder=""
                          defaultValue={data?.ID_BAHAN?.toString()}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {bahanBaku.map((item: BAHAN_BAKU) => (
                          <SelectItem
                            key={item.ID_BAHAN}
                            value={item.ID_BAHAN.toString()}
                          >
                            {" "}
                            {item.NAMA_BAHAN}{" "}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlah_dibutuhkan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Dibutuhkan</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" value={field.value === 0 ? "" : field.value} />
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
              {isLoading ? <Spinner /> : data ? "Edit Resep" : "Tambah Resep"}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditDetailResep;
