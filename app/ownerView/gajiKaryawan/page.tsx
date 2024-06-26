"use client";
import React from "react";
import Pagination from "@/components/admin/Pagination";
import TableGajiKaryawan from "@/components/owner/TableGajiKaryawan";
import { GAJI_KARYAWAN, QueryParams } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<GAJI_KARYAWAN[]>([]);
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
    const res = await axios.get("/api/gajiKaryawan", {
      params: queryParams,
    });
    setData(res.data.data);
    setTotalData(res.data.totalData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">List Gaji Karyawan</h2>
      <div className="flex justify-between items-center my-10">
      </div>

      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        <TableGajiKaryawan
          data={data}
          refreshData={fetchData}
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
