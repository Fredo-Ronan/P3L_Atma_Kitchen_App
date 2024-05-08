"use client";
import { createKaryawanSchema } from "@/app/validation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { KARYAWAN, ROLE } from "@/types";
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
  data?: KARYAWAN;
  refreshData: () => void;
}

const CreateEditKaryawan = ({ data, refreshData }: Props) => {

  useEffect(() => {
    form.reset({
      id_role: data?.ID_ROLE?.toString() || "",
      nama_karyawan: data?.NAMA_KARYAWAN || "",
      email_karyawan: data?.EMAIL_KARYAWAN || "",
      alamat_karyawan: data?.ALAMAT_KARYAWAN || "",
      no_telp_karyawan: data?.NO_TELP_KARYAWAN || "",
    });
  }, [data]);

  const form = useForm<z.infer<typeof createKaryawanSchema>>({
    resolver: zodResolver(createKaryawanSchema),
    defaultValues: {
      id_role: data?.ID_ROLE?.toString() || "",
      nama_karyawan: data?.NAMA_KARYAWAN || "",
      email_karyawan: data?.EMAIL_KARYAWAN || "",
      alamat_karyawan: data?.ALAMAT_KARYAWAN || "",
      no_telp_karyawan: data?.NO_TELP_KARYAWAN || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeBtn = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: z.infer<typeof createKaryawanSchema>) {
    try {
      setIsLoading(true);

      const {
        id_role,
        nama_karyawan,
        email_karyawan,
        alamat_karyawan,
        no_telp_karyawan,
      } = values;

      if (data) {
        const response = await axios.put(`/api/karyawan/${data.ID_KARYAWAN}`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_role,
            nama_karyawan,
            email_karyawan,
            alamat_karyawan,
            no_telp_karyawan,
          }),
        });

        if (response.data.status !== 200) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasi Mengubah Data Karyawan");
      } else {
        const response = await axios.post("/api/karyawan", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_role,
            nama_karyawan,
            email_karyawan,
            alamat_karyawan,
            no_telp_karyawan,
          }),
        });

        if (response.data.status !== 201) {
          return toast.error(response.data.message);
        }

        toast.success("Berhasil Menambah Data Karyawan");
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

  const [roles, setRoles] = useState<ROLE[]>([]);

  const fetchRole = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/role");
    setRoles(res.data.data);
    console.log("Data role berhasil diambil:", res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRole();

    // form.reset({
    //   id_role: String(data?.ID_ROLE) || "",
    //   nama_karyawan: data?.NAMA_KARYAWAN || "",
    //   email_karyawan: data?.EMAIL_KARYAWAN || "",
    //   alamat_karyawan: data?.ALAMAT_KARYAWAN || "",
    //   no_telp_karyawan: data?.NO_TELP_KARYAWAN || "",
    // });
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
          <DialogTitle className="text-center">Karyawan</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <Dropdown
              options={roles.map((role) => ({
                value: role.ID_ROLE.toString(),
                label: role.NAMA_ROLE,
              }))}
              onChange={(selectedOption) =>
                form.setValue("id_role", selectedOption.value)
              }
              placeholder="Pilih Role"
              className="cursor-pointer"
              controlClassName="p-2 w-full border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md cursor-pointer relative flex justify-between items-center"
              menuClassName="p-2 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-300 cursor-pointer"
              arrowClassName="text-gray-700"
              arrowClosed={<span className="text-gray-700">&#9660;</span>}
              arrowOpen={<span className="text-gray-700">&#9650;</span>}
            /> */}

            <FormField
              control={form.control}
              name="id_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Role Karyawan</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={data?.ID_ROLE?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder=""
                          defaultValue={data?.ID_ROLE.toString()}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((item: ROLE) => (
                          <SelectItem
                            key={item.ID_ROLE}
                            value={item.ID_ROLE.toString()}
                          >
                            {" "}
                            {item.NAMA_ROLE}{" "}
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
              name="nama_karyawan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Karyawan</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email_karyawan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Karyawan</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_telp_karyawan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Telp Karyawan</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat_karyawan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Karyawan</FormLabel>
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
              {isLoading ? (
                <Spinner />
              ) : data ? (
                "Edit Karyawan"
              ) : (
                "Tambah Karyawan"
              )}
            </Button>
            <DialogClose hidden ref={closeBtn} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditKaryawan;
