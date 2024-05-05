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
import { filterTersedia, filterLoyang, jenisProduk, jenisMakanan } from "@/constants/mapping";
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
    const [urlImage, setUrlImage] = useState<String>("");
    const [isTitipan, setIsTitipan] = useState(false);
    const [isCake, setIsCake] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const [isEditGambar, setIsEditGambar] = useState(false);
    const [isLoadingEditKuota, setIsLoadingEditKuota] = useState(false);

  useEffect(() => {
    form.reset({
      nama_produk: data?.NAMA_PRODUK || "",
      harga_produk: data?.HARGA_PRODUK || undefined,
      jenis_makanan: data?.JENIS_MAKANAN || "",
      deskripsi_produk: data?.DESKRIPSI_PRODUK || "",
      stok: data?.STOK || 0,
      loyang: data?.LOYANG || "",
      status_produk: data?.STATUS_PRODUK || "",
      jenis_produk: data?.JENIS_PRODUK || ""
    });
  }, [data]);

  const form = useForm<z.infer<typeof createProdukSchema>>({
    resolver: zodResolver(createProdukSchema),
    defaultValues: {
      nama_produk: data?.NAMA_PRODUK || "",
      harga_produk: data?.HARGA_PRODUK || undefined,
      jenis_makanan: data?.JENIS_MAKANAN || "",
      deskripsi_produk: data?.DESKRIPSI_PRODUK || "",
      stok: data?.STOK || 0,
      loyang: data?.LOYANG || "",
      status_produk: data?.STATUS_PRODUK || "",
      jenis_produk: data?.JENIS_PRODUK || ""
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createProdukSchema>) {
    try {
      setIsLoading(true);

      if (data) {
        // console.log(data?.GAMBAR_PRODUK);
        let resultUploadImage;
        // store image to edge store first
        if(file && isEditGambar){
          setErrorFile(false);
          await edgestore.publicFiles.delete({ url: data?.GAMBAR_PRODUK });
          resultUploadImage = await edgestore.publicFiles.upload({ file });
  
          // console.log("FUCKING UPLOAD IMAGE!");
          // console.log(resultUploadImage)
  
          // console.log(resultUploadImage.url);
        } else if(!file && isEditGambar) {
          setErrorFile(true);
          setIsLoading(false);
          return
        }
        
        const response = await axios.put(`/api/produk/${data.ID_PRODUK}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_produk: values.nama_produk,
            harga_produk: values.harga_produk,
            jenis_makanan: values.jenis_makanan,
            deskripsi_produk: values.deskripsi_produk,
            stok: values.stok,
            loyang: values.loyang || "",
            status_produk: values.status_produk,
            jenis_produk: values.jenis_produk,
            gambar_produk: isEditGambar && resultUploadImage !== undefined ? resultUploadImage.url : data?.GAMBAR_PRODUK
          }),
        });

        if (response.status !== 200) {
          throw new Error("Gagal mengubah produk");
        }

        toast.success("Berhasil mengubah produk");
      } else {
        let resultUploadImage;
        // store image to edge store first
        if(file){
          setErrorFile(false);
          resultUploadImage = await edgestore.publicFiles.upload({ file });
  
          // console.log("FUCKING UPLOAD IMAGE!");
          // console.log(resultUploadImage)
  
          // console.log(resultUploadImage.url);
        } else {
          setErrorFile(true);
          setIsLoading(false);
          return
        }


        // then store the data to MYSQL database
        const response = await axios.post("/api/produk", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_produk: values.nama_produk,
            harga_produk: values.harga_produk,
            jenis_makanan: values.jenis_makanan,
            deskripsi_produk: values.deskripsi_produk,
            stok: values.stok,
            loyang: values.loyang || "",
            status_produk: values.status_produk,
            jenis_produk: values.jenis_produk,
            gambar_produk: resultUploadImage.url
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

  const editKuotaProduksiTrigger = () => {
    setIsLoadingEditKuota(true);
    window.location.href = `/adminView/produk/editKuotaProduk/${data?.NAMA_PRODUK}/${data?.ID_PRODUK}`
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
                    <Input {...field} onChange={(e) => field.onChange(Number(e.target.value))} type="number" value={field.value === 0 ? "" : field.value} />
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
            <div className="flex justify-between gap-4">
                <FormField
                control={form.control}
                name="status_produk"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                            <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={data?.STATUS_PRODUK || ""}
                            >
                            <SelectTrigger>
                                <SelectValue
                                placeholder="Status"
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
                    <FormItem className="w-full">
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
                                placeholder="Jenis"
                                defaultValue={data?.JENIS_PRODUK}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {jenisProduk.map((item: string) => (
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
                name="jenis_makanan"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Jenis Makanan</FormLabel>
                        <FormControl>
                            <Select
                            onValueChange={(value) => {
                                if(value === "Cake"){
                                  setIsCake(true);
                                } else {
                                  setIsCake(false);
                                }
                                field.onChange(value)
                            }}
                            defaultValue={data?.JENIS_MAKANAN || ""}
                            >
                            <SelectTrigger>
                                <SelectValue
                                placeholder="Jenis"
                                defaultValue={data?.JENIS_MAKANAN}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {jenisMakanan.map((item: string) => (
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
            </div>
            {
              isTitipan ?
              <></> :
              isCake ?
              <FormField
              control={form.control}
              name="loyang"
              render={({ field }) => (
                  <FormItem className="w-full">
                      <FormLabel>Loyang</FormLabel>
                      <FormControl>
                          <Select
                          onValueChange={(value) => {
                              field.onChange(value)
                          }}
                          defaultValue={data?.LOYANG || ""}
                          >
                          <SelectTrigger>
                              <SelectValue
                              placeholder="Loyang"
                              defaultValue={data?.LOYANG}
                              />
                          </SelectTrigger>
                          <SelectContent>
                              {filterLoyang.map((item: string) => (
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
              /> : <></>
            }
            {
                isTitipan || data ? 
                <FormField
                    control={form.control}
                    name="stok"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stok</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} value={field.value === 0 ? "" : field.value}/>
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

                    {
                      isEditGambar ?
                      <>
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
                        <Button className="mt-4" variant="destructive" onClick={() => setIsEditGambar(!isEditGambar)}>Batal Edit Gambar</Button>
                      </>
                      :
                      <>
                        <img src={data?.GAMBAR_PRODUK} alt="" width={200} height={200} />
                        <Button className="mt-4" onClick={() => setIsEditGambar(!isEditGambar)}>Edit Gambar Produk</Button>
                      </>
                    }
                </div>
            }
            <div className="flex justify-between">
              <Button
                type="submit"
                className={cn({
                  "bg-blue-500 hover:bg-blue-500/50": !data,
                  "bg-orange-500 hover:bg-orange-500/50": data,
                })}
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : data ? "Edit Produk" : "Tambah"}
              </Button>
              {
                data?.JENIS_PRODUK === "Pre Order" ?
                <Button type="button" onClick={() => editKuotaProduksiTrigger()} className={cn({"mx-2": data, "hidden": !data})}>
                  {isLoadingEditKuota ? <Spinner/> : "Edit Kuota Produksi"}
                </Button>
                : <></>
              }
            </div>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditProduk;
