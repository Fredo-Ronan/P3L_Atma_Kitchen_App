"use client";
import CreateEditBahanBaku from "@/components/admin/CreateEditBahanBaku";
import Filter from "@/components/admin/Filter";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import TableBahanBaku from "@/components/admin/TableBahanBaku";
import { satuanFilter } from "@/constants/mapping";
import { BAHAN_BAKU, QueryParams } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<BAHAN_BAKU[]>([]);
  const router = useRouter();
  const [totalData, setTotalData] = useState(0);
  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    const res = await axios.get("/api/bahanBaku", { params: queryParams });
    setData(res.data.data);
    setTotalData(res.data.totalData);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

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
        <div className="flex items-center gap-4">
          <Filter filter={satuanFilter} />
          <LocalSearchBar route="/adminView/bahanBaku" />
        </div>
        <CreateEditBahanBaku refreshData={refreshData} />
      </div>
      <TableBahanBaku
        data={data}
        refreshData={refreshData}
        deleteData={deleteData}
      />
      <div className="flex items-center justify-center mt-4">
        <Pagination totalContent={totalData} totalPage={10} currentPage={Number(searchParams.page || 1)}/>
      </div>
    </div>
  );
};

export default Page;
