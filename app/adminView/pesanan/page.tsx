"use client";
import Pagination from "@/components/admin/Pagination";
import TablePesanan from "@/components/admin/TablePesanan";
import { PESANAN, QueryParams } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const Page = ({ searchParams }: { searchParams: QueryParams }) => {
  const [pesananPickUp, setPesananPickup] = useState<PESANAN[]>([]);
  const [pesananDelivery, setPesananDelivery] = useState<PESANAN[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [totalData, setTotalData] = useState(0);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchPesananPickUp = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/pesananPickUp", { params: queryParams });

    if (res.data.data.length <= 0) {
      setIsLoading(false);
      setPesananPickup(res.data.data);
      setTotalData(res.data.totalData);
    } else {
      setPesananPickup(res.data.data);
      setTotalData(res.data.totalData);
      setIsLoading(false);
    }
  };

  const fetchPesananDelivery = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/pesananDelivery", { params: queryParams });

    if (res.data.data.length <= 0) {
      setIsLoading(false);
      setPesananDelivery(res.data.data);
      setTotalData(res.data.totalData);
    } else {
    setPesananDelivery(res.data.data);
      setTotalData(res.data.totalData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPesananPickUp();
    fetchPesananDelivery();
  }, [searchParams]);

  const refreshData = () => {
    fetchPesananPickUp();
    fetchPesananDelivery();
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">List Pesanan Customer</h1>
      </div>
      <div className="mt-9">
        {isLoading ? (
          <div className="flex justify-center flex-1 my-10">
            <SyncLoader color="#2563eb" />
          </div>
        ) : (
            <div className="flex space-x-4">
            <div className="w-1/2">
              <p className="text-lg font-semibold mb-2">PickUp</p>
              <div className="border border-gray-300 p-4">
                <TablePesanan
                  data={pesananPickUp}
                  refreshData={refreshData}
                />
              </div>
            </div>
            <div className="w-1/2">
              <p className="text-lg font-semibold mb-2">Delivery</p>
              <div className="border border-gray-300 p-4">
                <TablePesanan
                  data={pesananDelivery}
                  refreshData={refreshData}
                />
              </div>
            </div>
          </div>
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
