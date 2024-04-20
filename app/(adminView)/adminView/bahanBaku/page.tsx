"use client";
import CreateEditBahanBaku from "@/components/admin/CreateEditBahanBaku";
import Filter from "@/components/admin/Filter";
import TableBahanBaku from "@/components/admin/TableBahanBaku";
import { satuanFilter } from "@/constants/mapping";
import { BAHAN_BAKU } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [data, setData] = useState<BAHAN_BAKU[]>([]);
  const router = useRouter();
  
  const fetchData = async () => {
    const res = await axios.get("/api/bahanBaku");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
    router.refresh();
  };

  const deleteData = async (id: number) => {
    try {
   
      await axios.delete(`/api/bahanBaku/${id}`);
      refreshData();
      toast.success("Berhasil menghapus bahan baku");
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold">Bahan Baku</h1>
      <div className="flex items-center justify-between my-10">
        <Filter filter={satuanFilter} />
        <CreateEditBahanBaku refreshData={refreshData} />
      </div>
      <TableBahanBaku
        data={data}
        refreshData={refreshData}
        deleteData={deleteData}
      />
    </div>
  );
};

export default Page;
