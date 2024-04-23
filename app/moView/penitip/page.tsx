"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import CreateEditPenitip from "@/components/mo/CreateEditPenitip";
import TablePenitip from "@/components/mo/TablePenitip";
import { PENITIP, QueryParams } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<PENITIP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState<number>(0);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/penitip", {
      params: queryParams,
    });
    if (res.data.data.length <= 0) {
      setIsLoading(false);
      setData(res.data.data);
      setTotalData(res.data.totalData);
    } else {
      setIsLoading(false);
      setTotalData(res.data.totalData);
      setData(res.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const deleteData = async (id: number) => {
    try {
      await axios.delete(`/api/penitip/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Penitip</h2>
      <div className="flex justify-between items-center my-10">
        <LocalSearchBar route="/moView/penitip" />
        <CreateEditPenitip refreshData={fetchData} />
      </div>

      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        <TablePenitip
          data={data}
          refreshData={fetchData}
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
  );
};

export default Page;
