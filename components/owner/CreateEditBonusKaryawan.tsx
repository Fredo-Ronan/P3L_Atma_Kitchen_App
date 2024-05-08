"use client";
import { createBonusKaryawanSchema } from "@/app/validation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BONUS_KARYAWAN } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../shared/Spinner";
import { Textarea } from "../ui/textarea";
import { KARYAWAN } from "@/types";
import { Label } from "@/components/ui/label";
// import { Select } from "@radix-ui/react-select";
import Dropdown from "react-dropdown";

interface Props {
  data?: BONUS_KARYAWAN;
  refreshData: () => void;
}

const CreateEditBonusKaryawan = ({ data, refreshData }: Props) => {
  const form = useForm<z.infer<typeof createBonusKaryawanSchema>>({
    resolver: zodResolver(createBonusKaryawanSchema),
    defaultValues: {
      id_karyawan: data?.ID_KARYAWAN.toString() || "",
      tanggal_pemberian: data ? new Date(data.TANGGAL_PEMBERIAN) : new Date(),
      bonus: data?.BONUS || undefined,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createBonusKaryawanSchema>) {
    try {
      setIsLoading(true);

      const { id_karyawan, tanggal_pemberian, bonus } = values;

      if (data) {
        const response = await axios.put(
          `/api/bonusKaryawan/${data.ID_BONUS}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_karyawan,
              tanggal_pemberian,
              bonus,
            }),
          }
        );

        if (response.data.status !== 200) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasi Mengubah Data Karyawan");
      } else {
        const response = await axios.post("/api/bonusKaryawan", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_karyawan,
            tanggal_pemberian,
            bonus,
          }),
        });

        if (response.data.status !== 201) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasil Menambah Bonus Karyawan");
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

  const [karyawan, setKaryawan] = useState<KARYAWAN[]>([]);

  const fetchKaryawan = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/karyawan");
    setKaryawan(res.data.data);
    console.log("Data Karyawan berhasil diambil:", res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKaryawan();

    form.reset({
      id_karyawan: data?.ID_KARYAWAN.toString() || "",
      tanggal_pemberian: data ? new Date(data.TANGGAL_PEMBERIAN) : new Date(),
      bonus: data?.BONUS || undefined,
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
          <DialogTitle className="text-center">Bonus Karyawan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <Dropdown
                options={karyawan.map((karyawan) => ({
                  value: karyawan.ID_KARYAWAN.toString(),
                  label: karyawan.NAMA_KARYAWAN,
                }))}
                onChange={(selectedOption) =>
                  form.setValue("id_karyawan", selectedOption.value)
                }
                // value={form.getValues("id_karyawan")}
                placeholder="Pilih Nama Karyawan"
                // value={form.getValues("id_karyawan") || ""}
                className="cursor-pointer"
                controlClassName="p-2 w-full border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md cursor-pointer relative flex justify-between items-center"
                menuClassName="p-2 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-300 cursor-pointer"
                arrowClassName="text-gray-700"
                arrowClosed={<span className="text-gray-700">&#9660;</span>}
                arrowOpen={<span className="text-gray-700">&#9650;</span>}
              /> */}

            <FormField
              control={form.control}
              name="id_karyawan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Nama Karyawan</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={data?.ID_KARYAWAN?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder=""
                          defaultValue={data?.ID_KARYAWAN.toString( )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {karyawan.map((item: KARYAWAN) => (
                          <SelectItem
                            key={item.ID_KARYAWAN}
                            value={item.ID_KARYAWAN.toString()}
                          >
                            {" "}
                            {item.NAMA_KARYAWAN}{" "}
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
              defaultValue={new Date()}
              name="tanggal_pemberian"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pemberian</FormLabel>
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
              name="bonus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bonus</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      type="number"
                      value={field.value === 0 ? "" : field.value}
                    />
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
              ) : data ? (
                "Edit Bonus Karyawan"
              ) : (
                "Tambah Bonus Karyawan"
              )}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditBonusKaryawan;
