"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import TableCustomerHistori from "@/components/admin/TableCustomerHistori";
import { CustomerHistori, QueryParams } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [data, setData] = useState<CustomerHistori[]>([]);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/customer", { params: queryParams });
    setData(res.data.data);
    setTotalData(res.data.totalData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold">History Pesanan Customer</h1>
      <div className="flex items-center justify-between my-10">
        <div className="flex items-center gap-4">
          <LocalSearchBar />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        // TablePesananCustomer
        <TableCustomerHistori data={data} />
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
