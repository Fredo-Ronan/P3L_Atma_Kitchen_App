"use client";
import { createPengadaanBahanSchema, createPengeluaranLainSchema } from "@/app/validation";
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";  
import { cn } from "@/lib/utils";
import { BAHAN_BAKU, PENGADAAN_BAHAN } from "@/types";
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
import { dateConvertToNormal } from "@/utilities/dateParser";

interface Props {
  data?: PENGADAAN_BAHAN;
  dataBahan?: BAHAN_BAKU[];
  refreshData: () => void;
}

const CreateEditPengadaanBahan = ({ data, dataBahan, refreshData }: Props) => {
  const form = useForm<z.infer<typeof createPengadaanBahanSchema>>({
    resolver: zodResolver(createPengadaanBahanSchema),
    defaultValues: {
      harga_beli: data?.HARGA_BELI_BAHAN || undefined,
      tanggal_beli:  data
      ? new Date(data.TANGGAL_BELI)
      : new Date(),
      jumlah_beli: data?.JUMLAH_BELI || 0
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [bahanTerpilih, setBahanTerpilih] = useState<BAHAN_BAKU>();
  const [openAccordion, setOpenAccordion] = useState("");
  const [errorPilihBahan, setErrorPilihBahan] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createPengadaanBahanSchema>) {
    try {
      setIsLoading(true);

      if(bahanTerpilih === undefined){
        setErrorPilihBahan(true);
        return
      }

      if (data) {
        // edit
        const response = await axios.put(
          `/api/pengadaanBahan/${data.ID_PENGADAAN_BAHAN}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_bahan: bahanTerpilih?.ID_BAHAN,
              nama_bahan: bahanTerpilih?.NAMA_BAHAN,
              harga_beli_bahan: values.harga_beli,
              tanggal_beli: dateConvertToNormal(values.tanggal_beli.toString()),
              jumlah_beli: values.jumlah_beli,
            }),
          }
        );

        if (response.status !== 200) {
            toast.error("Gagal mengubah pengadaan bahan");
        }

        toast.success("Berhasil mengubah pengadaan bahan");
      } else {
        const response = await axios.post("/api/pengadaanBahan", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_bahan: bahanTerpilih?.ID_BAHAN,
            nama_bahan: bahanTerpilih?.NAMA_BAHAN,
            harga_beli_bahan: values.harga_beli,
            tanggal_beli: dateConvertToNormal(values.tanggal_beli.toString()),
            jumlah_beli: values.jumlah_beli,
          }),
        });

        if (response.status !== 200) {
            toast.error("Gagal mengubah pengadaan bahan");
        }

        toast.success("Berhasil menambah data pengadaan bahan");
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
        harga_beli: data?.HARGA_BELI_BAHAN || undefined,
        tanggal_beli:  data
        ? new Date(data.TANGGAL_BELI)
        : new Date(),
        jumlah_beli: data?.JUMLAH_BELI || 0
    });
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(`bg-blue-500 rounded shadow text-white`, {
          "py-2.5 px-6 hover:bg-blue-500/50": !data,
          "py-1 px-3 bg-orange-500 hover:bg-orange-500/50": data,
        })}
        onClick={() => {
            form.reset();
            if(data){
                setBahanTerpilih(dataBahan?.filter(item => item.ID_BAHAN === data.ID_BAHAN)[0]);
            } else {
                setBahanTerpilih(undefined);
            }
            setErrorPilihBahan(false);
        }}
      >
        {data ? "Edit" : "Tambah"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Pengadaan Bahan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
                {errorPilihBahan && bahanTerpilih === undefined ? <p className="text-red-500">Bahan Harus dipilih!</p> : <></>}
                <AccordionItem value="item-1" className="bg-slate-300 rounded-lg">
                    <AccordionTrigger className="p-4">{bahanTerpilih ? bahanTerpilih.NAMA_BAHAN : "Pilih Bahan yang ingin di catat"}</AccordionTrigger>
                    <AccordionContent className="max-h-80 overflow-y-scroll">
                        {
                            dataBahan?.map((data) => (
                                <div key={data.ID_BAHAN} className="bg-white mb-4 px-4 py-2 mx-4 rounded-xl flex justify-between items-center">
                                    <p>{data.NAMA_BAHAN}</p>
                                    <Button type="button" className="bg-blue-500" onClick={() => {
                                        setBahanTerpilih(data);
                                        setOpenAccordion("");
                                    }}>Choose</Button>
                                </div>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


            <FormField
              control={form.control}
              name="harga_beli"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Beli</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} value={field.value === 0 ? "" : field.value}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue={new Date()}
              name="tanggal_beli"
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
            <FormField
              control={form.control}
              name="jumlah_beli"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Beli</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} value={field.value === 0 ? "" : field.value}/>
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

export default CreateEditPengadaanBahan;
