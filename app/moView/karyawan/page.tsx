"use client";
import React from "react";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import TableKaryawan from "@/components/mo/TabelKaryawan";
import { KARYAWAN, QueryParams } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import CreateEditKaryawan from "@/components/mo/CreateEditKaryawan";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<KARYAWAN[]>([]);
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
    const res = await axios.get("/api/karyawan", {
      params: queryParams,
    });
    setData(res.data.data);
    setTotalData(res.data.totalData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const deleteData = async (id: number) => {
    try {
      await axios.delete(`/api/karyawan/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">List Karyawan</h2>
      <div className="flex justify-between items-center my-10">
        <LocalSearchBar/>
        <CreateEditKaryawan refreshData={fetchData} />
      </div>

      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        <TableKaryawan
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
