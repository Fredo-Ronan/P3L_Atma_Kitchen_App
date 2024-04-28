"use client";
import { createProdukSchema } from "@/app/validation";
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
import { filterTersedia, filterJenisProduk } from "@/constants/mapping";
import { cn } from "@/lib/utils";
import { PRODUK } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";
import { SingleImageDropzone } from '@/components/SingleImageDropzone';
import { useEdgeStore } from '@/lib/edgestore';

interface Props {
  data?: PRODUK;
  refreshData: () => void;
}

const CreateEditProduk = ({ data, refreshData }: Props) => {
    const [file, setFile] = useState<File>();
    const { edgestore } = useEdgeStore();
    const [urlImage, setUrlImage] = useState<String>();
    const [isTitipan, setIsTitipan] = useState(false);
    const [errorFile, setErrorFile] = useState(false);

  useEffect(() => {
    form.reset({
      nama_produk: data?.NAMA_PRODUK || "",
      harga_produk: String(data?.HARGA_PRODUK) || "",
      deskripsi_produk: data?.DESKRIPSI_PRODUK || "",
      stok: data?.STOK || 0,
      status_produk: data?.STATUS_PRODUK || "",
      jenis_produk: data?.JENIS_PRODUK || ""
    });
  }, [data]);

  const form = useForm<z.infer<typeof createProdukSchema>>({
    resolver: zodResolver(createProdukSchema),
    defaultValues: {
      nama_produk: data?.NAMA_PRODUK || "",
      harga_produk: String(data?.HARGA_PRODUK) || "",
      deskripsi_produk: data?.DESKRIPSI_PRODUK || "",
      stok: data?.STOK || 0,
      status_produk: data?.STATUS_PRODUK || "",
      jenis_produk: data?.JENIS_PRODUK || ""
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createProdukSchema>) {
    try {
      setIsLoading(true);

      // upload image to edge store first
      if(file){
        setErrorFile(false);
        const resultUploadImage = await edgestore.publicFiles.upload({ file });

        setUrlImage(resultUploadImage.url);
      } else {
        setErrorFile(true);
        return
      }

      if (data) {
        const response = await axios.put(`/api/produk/${data.ID_PRODUK}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_produk: values.nama_produk,
            harga_produk: Number(values.harga_produk),
            deskripsi_produk: values.deskripsi_produk,
            stok: values.stok,
            status_produk: values.status_produk,
            jenis_produk: values.jenis_produk,
            gambar_produk: urlImage
          }),
        });

        if (response.status !== 200) {
          throw new Error("Gagal mengubah produk");
        }

        toast.success("Berhasil mengubah produk");
      } else {
        const response = await axios.post("/api/produk", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_produk: values.nama_produk,
            harga_produk: Number(values.harga_produk),
            deskripsi_produk: values.deskripsi_produk,
            stok: values.stok,
            status_produk: values.status_produk,
            jenis_produk: values.jenis_produk,
            gambar_produk: urlImage
          }),
        });

        console.log(response.statusText);

        toast.success("Berhasil menambahkan produk");
      }

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal menambahkan produk");
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
          "py-1 px-3 bg-orange-500 hover:bg-orange-500/50": data,
        })}
        onClick={() => form.reset()}
      >
        {data ? "Edit" : "Tambah"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Produk</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama_produk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga_produk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Produk</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deskripsi_produk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Produk</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status_produk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={data?.STATUS_PRODUK || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Tersedia atau Kosong?"
                          defaultValue={data?.STATUS_PRODUK}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filterTersedia.map((item: string) => (
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
            <FormField
              control={form.control}
              name="jenis_produk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Produk</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if(value === "Titipan"){
                            setIsTitipan(true)
                        }

                        if(value === "Pre Order"){
                            setIsTitipan(false);
                        }
                        field.onChange(value)
                      }}
                      defaultValue={data?.JENIS_PRODUK || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Titipan atau Pre Order?"
                          defaultValue={data?.JENIS_PRODUK}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filterJenisProduk.map((item: string) => (
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
            {
                isTitipan ? 
                <FormField
                    control={form.control}
                    name="stok"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stok</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                /> : <></>
            }
            {
                data?.GAMBAR_PRODUK === undefined ?

                <div className="flex flex-col justify-center items-center">
                    <p className="text-md">Gambar Produk</p>
                    <SingleImageDropzone
                        width={200}
                        height={200}
                        value={file}
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 1 // 1 MB
                        }}
                        onChange={(file) => {
                            setFile(file);
                        }}
                    />
                    {errorFile ? 
                    <p className="text-md text-red-500">Gambar Produk harus diisi!</p>
                    : <></>
                    }
                </div>
                : 
                <div className="flex flex-col justify-center items-center">
                    <p className="text-md">Gambar Produk</p>
                    <img src={data?.GAMBAR_PRODUK} alt="" width={200} height={200} />
                </div>
            }
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

export default CreateEditProduk;
