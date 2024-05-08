"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import CreateEditResep from "@/components/admin/CreateEditResep";
import Pagination from "@/components/admin/Pagination";
import TableResep from "@/components/admin/TableResep";
import { RESEP, QueryParams } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<RESEP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [totalData, setTotalData] = useState(0);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/resep", { params: queryParams });

    if (res.data.data.length <= 0) {
      setIsLoading(false);
      setData(res.data.data);
      setTotalData(res.data.totalData);
    } else {
      setData(res.data.data);
      setTotalData(res.data.totalData);
      setIsLoading(false);
    }
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
      await axios.delete(`/api/resep/${id}`);
      refreshData();
      toast.success("Berhasil menghapus bahan baku");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">List Resep</h1>
        <LocalSearchBar route="/adminView/bahanBaku" />
      </div>
      <CreateEditResep refreshData={refreshData} />
      <div className="mt-9">
        {isLoading ? (
          <div className="flex justify-center flex-1 my-10">
            <SyncLoader color="#2563eb" />
          </div>
        ) : (
          <TableResep
            data={data}
            refreshData={refreshData}
            deleteData={deleteData}
          />
        )}
        <div className="flex items-center justify-center mt-4">
          <Pagination
            totalContent={totalData}
            totalPage={10}
            currentPage={Number(searchParams.page) || 1}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
