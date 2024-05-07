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

const CreateEditHampers = ({
  data,
  dataProduk,
  produkSudahTerpilih,
  refreshData,
}: Props) => {
  const [produkTerpilih, setProdukTerpilih] = useState<PRODUK[]>(
    produkSudahTerpilih!! || []
  );
  const [totalHarga, setTotalHarga] = useState(data?.HARGA_HAMPERS || 0);
  const [checkAddition, setCheckAddition] = useState(
    data?.DESKRIPSI_HAMPERS.includes("+ Exclusive box and Card")
    ? true
    : false
  );
  const [errorPilihProduk, setErrorPilihProduk] = useState(false);

  const handleRemoveItem = (e: any) => {
    const idProduk = e.target.getAttribute("name");
    setProdukTerpilih((l) =>
      l.filter((item) => item.ID_PRODUK.toString() !== idProduk)
    );
  };

  const resetAllForm = () => {
    setProdukTerpilih(produkSudahTerpilih!! || []);
    setTotalHarga(data?.HARGA_HAMPERS || 0);
    setCheckAddition(
      data?.DESKRIPSI_HAMPERS.includes("+ Exclusive box and Card")
        ? true
        : false
    );
    setErrorPilihProduk(false);
  }

  useEffect(() => {
    setProdukTerpilih(produkSudahTerpilih!! || []);
    setTotalHarga(data?.HARGA_HAMPERS || 0);
    setCheckAddition(
      data?.DESKRIPSI_HAMPERS.includes("+ Exclusive box and Card")
        ? true
        : false
    );
    setErrorPilihProduk(false);
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
      setErrorPilihProduk(false);
      // todo for create and update hampers data

      if (produkTerpilih.length === 0) {
        setErrorPilihProduk(true);
        return;
      }

      if (data) {
        // update hampers (delete from relasi produk hampers first and insert the new one)
        // also update harga hampers di tabel hampers
        const idHampers = data.ID_HAMPERS;

        const resUpdateHampers = await axios.put(`/api/hampers/${idHampers}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_hampers: data.NAMA_HAMPERS,
            harga_hampers: totalHarga,
            deskripsi_hampers:
              data.DESKRIPSI_HAMPERS.includes("+ Exclusive box and Card") && // kalau deskripsi sebelumnya ada + Exclusive box and Card
              !checkAddition // dan di edit sekarang jadi unchecked
                ? values.deskripsi_hampers.split("+")[0] // brarti values yang di dapat dari data.DESKRIPSI_HAMPERS di split jadi cuma deskripsi saja
                : !data.DESKRIPSI_HAMPERS.includes(
                    "+ Exclusive box and Card" // tapi kalau deskripsi sebelumnya tidak ada + Exclusive box and Card
                  ) && checkAddition // dan di edit sekarang jadi checked/dicentang
                ? values.deskripsi_hampers + " + Exclusive box and Card" // brarti tambahin + Exclusive box
                : values.deskripsi_hampers, // kalau masih ngga di centang dan ngga memnuhi semua kondisi di atas, ya normal aja
          }),
        });

        // delete dulu data detil hampers yang lama
        const resDeleteDetilHampers = await axios.delete(`/api/hampers/deleteDetilHampers/${idHampers}`);

        // insert detil hampers yang baru
        produkTerpilih.forEach(async (data) => {
          const resInsertDetilHampers = await axios.post(
            `/api/hampers/insertDetilHampers`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_hampers: idHampers,
                id_produk: data.ID_PRODUK,
              }),
            }
          );
        });

        toast.success("Berhasil mengubah detil hampers");
      } else {
        // post operation (adding hampers)
        const resInsertHampers = await axios.post(`/api/hampers`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_hampers: values.nama_hampers,
            harga_hampers: totalHarga,
            deskripsi_hampers: checkAddition
              ? values.deskripsi_hampers + " + Exclusive box and Card"
              : values.deskripsi_hampers,
          }),
        });

        const insertedHampersId =
          resInsertHampers.data.insertedHampers.insertId;

        produkTerpilih.forEach(async (data) => {
          const resInsertDetilHampers = await axios.post(
            `/api/hampers/insertDetilHampers`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_hampers: insertedHampersId,
                id_produk: data.ID_PRODUK,
              }),
            }
          );
        });

        toast.success("Berhasil menambahkan hampers");
      }

      if (closeBtn.current && !isLoading) {
        closeBtn.current.click();
        refreshData();
      }
    } catch (error) {
      toast.error("Gagal menambahkan hampers");
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
          resetAllForm();
        }}
      >
        {data ? "Edit Isi Hampers" : "Tambah"}
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
                      <Input {...field} disabled={data ? true : false} />
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
                        disabled={data ? true : false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h1 className="font-bold text-lg text-center">
                Pilih Produk yang ingin dimasukkan ke hampers ini
              </h1>
              {errorPilihProduk && produkTerpilih.length === 0 ? (
                <p className="text-center italic text-red-500">
                  Produk Harus Dipilih!
                </p>
              ) : (
                <></>
              )}
            </div>

            <div className="flex gap-2 flex-wrap border p-2">
              {produkTerpilih.length !== 0 ? (
                produkTerpilih.map((data) => (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button
                        key={data.ID_PRODUK}
                        className="bg-blue-500"
                        type="button"
                        name={data.ID_PRODUK.toString()}
                        onClick={(e) => {
                          handleRemoveItem(e);
                          setTotalHarga(totalHarga - data.HARGA_PRODUK);
                        }}
                      >
                        {data.NAMA_PRODUK}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-red-500 text-white">
                      <div>Klik untuk batal/menghapus</div>
                    </HoverCardContent>
                  </HoverCard>
                ))
              ) : (
                <p className="italic opacity-50">
                  Produk terpilih akan tertampil disini
                </p>
              )}
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="bg-slate-200 px-4 rounded-lg"
              >
                <AccordionTrigger>Cake</AccordionTrigger>
                <AccordionContent
                  className="overflow-y-scroll max-h-80"
                  key={"cake"}
                >
                  {dataProduk?.map((data) =>
                    data.JENIS_MAKANAN === "Cake" ? (
                      <div
                        className="bg-white mb-2 px-4 py-2 flex justify-between items-center rounded"
                        key={data.ID_PRODUK}
                      >
                        <div>
                          <div className="flex items-start gap-2">
                            <img
                              src={data.GAMBAR_PRODUK}
                              width={100}
                              height={100}
                            />
                            <div>
                              <p className="text-lg">{data.NAMA_PRODUK}</p>
                              <p className="italic opacity-70">{data.LOYANG}</p>
                              <p className="font-bold text-md">
                                Rp. {data.HARGA_PRODUK}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="bg-blue-500"
                            onClick={() => {
                              setProdukTerpilih([...produkTerpilih, data]);
                              setTotalHarga(totalHarga + data.HARGA_PRODUK);
                            }}
                          >
                            ADD
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="bg-slate-200 px-4 rounded-lg"
              >
                <AccordionTrigger>Roti</AccordionTrigger>
                <AccordionContent
                  className="overflow-y-scroll max-h-80"
                  key={"roti"}
                >
                  {dataProduk?.map((data) =>
                    data.JENIS_MAKANAN === "Roti" ? (
                      <div
                        className="bg-white mb-2 px-4 py-2 flex justify-between items-center rounded"
                        key={data.ID_PRODUK}
                      >
                        <div>
                          <div className="text-lg">{data.NAMA_PRODUK}</div>
                          <img
                            src={data.GAMBAR_PRODUK}
                            width={100}
                            height={100}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="bg-blue-500"
                            onClick={() => {
                              setProdukTerpilih([...produkTerpilih, data]);
                              setTotalHarga(totalHarga + data.HARGA_PRODUK);
                            }}
                          >
                            ADD
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem
                value="item-1"
                className="bg-slate-200 px-4 rounded-lg"
              >
                <AccordionTrigger>Minuman</AccordionTrigger>
                <AccordionContent
                  className="overflow-y-scroll max-h-80"
                  key={"minuman"}
                >
                  {dataProduk?.map((data) =>
                    data.JENIS_MAKANAN === "Minuman" ? (
                      <div
                        className="bg-white mb-2 px-4 py-2 flex justify-between items-center rounded"
                        key={data.ID_PRODUK}
                      >
                        <div>
                          <div className="text-lg">{data.NAMA_PRODUK}</div>
                          <img
                            src={data.GAMBAR_PRODUK}
                            width={100}
                            height={100}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            className="bg-blue-500"
                            onClick={() => {
                              setProdukTerpilih([...produkTerpilih, data]);
                              setTotalHarga(totalHarga + data.HARGA_PRODUK);
                            }}
                          >
                            ADD
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center gap-2">
              <Checkbox
                id="addition"
                checked={checkAddition}
                onCheckedChange={() => {
                  setCheckAddition(!checkAddition);

                  // console.log(checkAddition);

                  // logic yang agak aneh dari checkbox shadcn UI
                  if (checkAddition) {
                    setTotalHarga(totalHarga - 50000);
                  } else {
                    setTotalHarga(totalHarga + 50000);
                  }
                }}
              />
              <label
                htmlFor="addition"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Excelusive box and card
              </label>
            </div>

            <div className="font-bold text-lg">
              Total Harga : Rp. {totalHarga}
            </div>

            <Button
              type="submit"
              className={cn({
                "bg-blue-500 hover:bg-blue-500/50": !data,
                "bg-orange-500 hover:bg-orange-500/50": data,
              })}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : data ? "Edit Isi Hampers" : "Tambah"}
            </Button>
            <DialogClose hidden ref={closeBtn} onClick={refreshData} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditHampers;
