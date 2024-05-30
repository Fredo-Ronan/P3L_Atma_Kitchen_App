"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
// import EditPengiriman from "@/components/admin/CreateEditResep";
import Pagination from "@/components/admin/Pagination";
import TablePembayaran from "@/components/admin/TablePembayaran";
import { PEMBAYARAN, QueryParams } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [data, setData] = useState<PEMBAYARAN[]>([]);
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
    const res = await axios.get("/api/pembayaran", { params: queryParams });

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

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">List Pembayaran Customer</h1>
        {/* <LocalSearchBar/> */}
      </div>
      <div className="mt-9">
        {isLoading ? (
          <div className="flex justify-center flex-1 my-10">
            <SyncLoader color="#2563eb" />
          </div>
        ) : (
          <TablePembayaran
            data={data}
            refreshData={refreshData}
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
