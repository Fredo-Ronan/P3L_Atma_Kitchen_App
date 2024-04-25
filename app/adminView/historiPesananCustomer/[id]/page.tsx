"use client";
import Filter from "@/components/admin/Filter";
import Pagination from "@/components/admin/Pagination";
import TablePesananHistori from "@/components/admin/TablePesananHistori";
import { Skeleton } from "@/components/ui/skeleton";
import { filterTransaksiPesanan } from "@/constants/mapping";
import { PesananHistori, QueryParams } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

interface Props {
  params: {
    id: string;
  };
  searchParams: QueryParams;
}

const Page = ({ params, searchParams }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [data, setData] = useState<PesananHistori[]>([]);
  const [user, setUser] = useState({
    NAMA_CUSTOMER: "",
  });

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get(`/api/transaksiPesanan/${params.id}`, {
      params: queryParams,
    });
    setData(res.data.data);
    setTotalData(res.data.totalData);
    setUser(res.data.user);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold">
        {isLoading ? (
          <Skeleton className="h-8 w-52" />
        ) : (
          `Transaksi Pesanan ${user.NAMA_CUSTOMER}`
        )}
      </h1>
      <div className="flex items-center justify-between my-10">
        <div className="flex items-center gap-4">
          <Filter filter={filterTransaksiPesanan} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        // TablePesananCustomer
        <TablePesananHistori data={data} id={params.id} />
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
