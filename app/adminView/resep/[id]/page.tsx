"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import CreateEditDetailResep from "@/components/admin/CreateEditDetailResep";
import Filter from "@/components/admin/Filter";
import Pagination from "@/components/admin/Pagination";
import TableDetailResep from "@/components/admin/TableDetailResep";
import { QueryParams, DETAIL_RESEP } from "@/types";
import axios from "axios";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";
// import { useParams } from "next/navigation";

interface Props {
    params: {
      id: string;
    };
    searchParams: QueryParams;
}

const DetailResep = ({ params, searchParams }: Props) => {
  const [data, setData] = useState<DETAIL_RESEP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [resep, setResep] = useState({
    NAMA_RESEP: "",
  });

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/relasiBahanResep/${params.id}`, {
        params: queryParams,
      });
      setData(res.data.data);
      setTotalData(res.data.totalData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const refreshData = () => {
    fetchData();
  };

  const deleteData = async (id: number) => {
    try {
      await axios.delete(`/api/relasiBahanResep/${id}`);
      refreshData();
      toast.success("Berhasil menghapus bahan baku");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">List Detail Resep</h1>
        <LocalSearchBar />
      </div>
      <h1 className="text-2xl font-bold">
        {
          `${resep.NAMA_RESEP}`
        }
      </h1>
      <CreateEditDetailResep id={params.id} refreshData={refreshData} />
      <div className="mt-9">
        {isLoading ? (
          <div className="flex justify-center flex-1 my-10">
            <SyncLoader color="#2563eb" />
          </div>
        ) : (
          <TableDetailResep
            data={data}
            refreshData={refreshData}
            deleteData={deleteData}
            id={params.id}
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

export default DetailResep;
