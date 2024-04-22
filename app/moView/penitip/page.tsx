"use client";
import CreateEditBahanBaku from "@/components/admin/CreateEditBahanBaku";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import CreateEditPenitip from "@/components/mo/CreateEditPenitip";
import TablePenitip from "@/components/mo/TablePenitip";
import { PENITIP, QueryParams } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<PENITIP[]>([]);

  const [totalData, setTotalData] = useState<number>(0);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page:
      searchParams.page || 1 || Number(searchParams.page) <= 0
        ? 1
        : Number(searchParams.page),
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    const res = await axios.get("/api/penitip", {
      params: queryParams,
    });

    setTotalData(res.data.totalData);
    setData(res.data.data);
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

      <TablePenitip
        data={data}
        refreshData={fetchData}
        deleteData={deleteData}
      />

      <div className="flex items-center justify-center mt-4">
        <Pagination
          totalContent={totalData}
          totalPage={10}
          currentPage={
            searchParams.page || 1 || Number(searchParams.page) <= 0
              ? 1
              : Number(searchParams.page)
          }
        />
      </div>
    </div>
  );
};

export default Page;
