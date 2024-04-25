"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import CreateEditPengeluaranLain from "@/components/mo/CreateEditPengeluaranLain";
import CreateEditPenitip from "@/components/mo/CreateEditPenitip";
import TablePengeluaranLain from "@/components/mo/TablePengeluaranLain";
import { QueryParams } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/pengeluaranLain", {
      params: queryParams,
    });
    setData(res.data.data);
    setTotalData(res.data.totalData);
    setIsLoading(false);
  };

  const deleteData = async (id: number) => {
    await axios.delete(`/api/pengeluaranLain/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Pengeluaran Lain</h2>
      <div className="flex justify-between items-center my-10">
        <LocalSearchBar />
        <CreateEditPengeluaranLain refreshData={fetchData} />
      </div>

      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        <TablePengeluaranLain
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
