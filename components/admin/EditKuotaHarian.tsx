import { KUOTA_HARIAN } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editKuotaHarianSchema } from '@/app/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '../shared/Spinner';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
    data?: KUOTA_HARIAN;
    earlier: boolean;
    refreshData: () => void;
}

const EditKuotaHarian = ({ data, earlier, refreshData }: Props) => {

    const closeBtn = useRef<HTMLButtonElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [kuotaValue, setKuotaValue] = useState(data?.KUOTA || 0);
    const form = useForm<z.infer<typeof editKuotaHarianSchema>>({
        resolver: zodResolver(editKuotaHarianSchema),
        defaultValues: {
            kuota: data?.KUOTA || 0,
            keterangan: data?.KETERANGAN || ""
        }
    });

    useEffect(() => {
        setKuotaValue(data?.KUOTA || 0);
        form.reset({
            kuota: data?.KUOTA || 0,
            keterangan: data?.KETERANGAN || ""
        })
    }, [data]);

    async function onSubmit(values: z.infer<typeof editKuotaHarianSchema>){
        setIsLoading(true);
        
        console.log(values.kuota);
        console.log(values.keterangan);

        const response = await axios.put(`/api/getKuotaHarian/${data?.ID_PRODUK}`, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                kuota: values.kuota,
                keterangan: values.keterangan,
                tanggal: data?.TANGGAL_KUOTA.split("T")[0]
            })
        })

        if(response.status !== 200){
            throw new Error("Gagal Update Kuota")
        }

        setIsLoading(false);
        toast.success(`Berhasil Mengubah Kuota Tanggal ${data?.TANGGAL_KUOTA.split("T")[0]}`);
        refreshData();
        if(closeBtn.current && !isLoading){
            closeBtn.current.click();
        }
    }

  return (
    <Dialog>
        <HoverCard>
            <HoverCardTrigger asChild>
            <DialogTrigger
                className={`rounded shadow text-white py-1 px-3 bg-orange-500 ${earlier ? "bg-slate-400" : "hover:bg-orange-500/50"}`}
                disabled={earlier}
                onClick={() => form.reset()}
            >
                Edit
            </DialogTrigger>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-red-500">
            <div className="text-white">
                <p>Tidak bisa di edit karena tanggal sudah lewat</p>
            </div>
            </HoverCardContent>
        </HoverCard>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Edit Kuota Produksi Tanggal
            <div className='mt-2'>
                <Badge variant={"secondary"} className='text-md'>
                    {data?.TANGGAL_KUOTA.split("T")[0]}
                </Badge>
            </div>
            </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="kuota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuota</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        // setKuotaValue(Number(e.target.value));
                    }} type='number'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Input {...field} type='text'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className='flex gap-2'>
                <Button type='button' className='bg-red-600 hover:bg-red-500 text-md' disabled={kuotaValue === 0} onClick={() => setKuotaValue(kuotaValue !== 0 ? kuotaValue - 1 : kuotaValue)}>-</Button>
                <Button type='button' className='bg-green-600 hover:bg-green-500 text-md' onClick={() => setKuotaValue(kuotaValue + 1)}>+</Button>
            </div> */}
            <div className="flex justify-between">
              <Button
                type="submit"
                className={"bg-orange-500 hover:bg-orange-500/50"}
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Edit Kuota"}
              </Button>
            </div>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditKuotaHarian