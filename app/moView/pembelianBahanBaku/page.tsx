"use client";
import LocalSearchBar from "@/components/admin/LocalSearchBar";
import Pagination from "@/components/admin/Pagination";
import CreateEditPengadaanBahan from "@/components/mo/CreateEditPengadaanBahan";
import TablePengadaanBahan from "@/components/mo/TablePengadaanBahan";
import { BAHAN_BAKU, PENGADAAN_BAHAN, QueryParams } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

const PembelianBahanBakuPage = ({ searchParams }: { searchParams: QueryParams }) => {
    const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPembelianBahan, setDataPembelianBahan] = useState<PENGADAAN_BAHAN[]>([]);
  const [dataAllBahan, setDataAllBahan] = useState<BAHAN_BAKU[]>([]);
  const [totalData, setTotalData] = useState(0);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const fetchAllBahan = async () => {
    setIsLoading(true);

    const resGetAllBahan = await axios.get(`/api/getAllBahan/1`);

    setDataAllBahan(resGetAllBahan.data.dataBahan);
  }

  const fetchData = async () => {
    
    const res = await axios.get("/api/pengadaanBahan", {
      params: queryParams,
    });
    setDataPembelianBahan(res.data.data);
    setTotalData(res.data.totalData);
    setIsLoading(false);
  };

  const refreshData = async () => {
    fetchAllBahan();
    fetchData();
    router.refresh();
  }

  const deleteData = async (id: number) => {
    await axios.delete(`/api/pengadaanBahan/${id}`);
    refreshData();
  };

  useEffect(() => {
    fetchAllBahan();
    fetchData();
  }, [searchParams]);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Pengadaan Bahan</h2>
      <div className="flex justify-between items-center my-10">
        <LocalSearchBar />
        <CreateEditPengadaanBahan dataBahan={dataAllBahan} refreshData={fetchData} />
      </div>

      {isLoading ? (
        <div className="flex justify-center flex-1 my-10">
          <SyncLoader color="#2563eb" />
        </div>
      ) : (
        <TablePengadaanBahan
          data={dataPembelianBahan}
          dataBahan={dataAllBahan}
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

export default PembelianBahanBakuPage;
