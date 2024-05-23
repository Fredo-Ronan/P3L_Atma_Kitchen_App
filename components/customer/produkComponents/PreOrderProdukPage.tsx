import { Skeleton } from "@/components/ui/skeleton";
import { KUOTA_HARIAN, PRODUK_FOR_CUSTOMER_UI, QueryParams } from "@/types";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import DetilProdukPage from "./DetilProdukPage";
import axios from "axios";
import FilterDate from "./FilterDate";
import { getDatesAfterTodayToN } from "@/utilities/dateParser";

interface DATA_KUOTA {
  nama_produk: string;
  kuotaProduk: KUOTA_HARIAN[];
}

const PreOrderProdukPage = ({
  dataProdukPreOrder,
  searchParams
}: {
  dataProdukPreOrder: PRODUK_FOR_CUSTOMER_UI[];
  searchParams: QueryParams;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dates, setDates] = useState<string[]>([]);
  const [dataKuotaProdukToday, setDataKuotaProdukToday] = useState<
    DATA_KUOTA[]
  >([]);

  const queryParams: QueryParams = {
    q: searchParams.q,
    orderBy: searchParams.orderBy,
    page: searchParams.page,
    filter: searchParams.filter,
  };

  const getDates = async () => {
    try {
      const resLastTanggal = await axios.get(`/api/getLastTanggalKuota`);

      const finalLastTanggalKuota = resLastTanggal.data.lastTanggal[0].LAST_TANGGAL.split("T")[0];

      const datesAfterTodayToN = getDatesAfterTodayToN(new Date(finalLastTanggalKuota));

      setDates(datesAfterTodayToN);
    }catch(error){
      console.log(error);
      throw error;
    }
  }

  const fetchKuotaProduk = async () => {
    setIsLoading(true);
    try {
      const kuotaPromises = dataProdukPreOrder.map(async (data) => {
        if (data.JENIS_PRODUK === "Pre Order") {
          const resKuotaProduk = await axios.get(`/api/kuotaProduk/${data.ID_PRODUK}`, { params: queryParams });
          if (resKuotaProduk.status !== 200) {
            throw new Error("Failed to fetch kuota produk");
          }

          const resKuotaProdukFinal = await resKuotaProduk.data;
          return {
            nama_produk: data.NAMA_PRODUK,
            kuotaProduk: resKuotaProdukFinal.kuotaProdukToday,
          };
        }

        return { nama_produk: "", kuotaProduk: null };
      });

      const allDataKuota = await Promise.all(kuotaPromises);
      // console.log(allDataKuota);
      setDataKuotaProdukToday(allDataKuota);
    //   console.log(allDataKuota);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetch kuota produk " + error);
      throw error;
    }
  };

  useEffect(() => {
    getDates();
    fetchKuotaProduk();
  }, [dataProdukPreOrder, searchParams]);

  return (
    <div>
      <FilterDate filter={dates}/>
      <div className="mt-2">
        <div className="font-poetsen italic opacity-50">FAQ: Kuota ini di update seminggu sekali dan jika hanya tertera 1 tanggal saja, maka keesokan harinya otomatis akan reset/ditambah tanggal untuk seminggu ke depannya lagi</div>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 justify-center">
        {dataProdukPreOrder?.map((data, index) => (
          <div className="w-72" key={index}>
            <Card>
              <CardContent className="py-6">
                <div className="flex justify-center">
                  <div className="relative w-full h-52">
                    <img
                      src={data.GAMBAR_PRODUK}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                </div>
                <div>
                  <h1 className="my-2 font-poetsen font-bold text-2xl">
                    {data.NAMA_PRODUK}
                  </h1>
                  {data.HARGA_PRODUK.map((harga, indexHarga) => (
                    <div className="flex" key={harga + 1}>
                      <p key={harga + 2} className="font-poetsen text-lg">
                        Rp. {harga.toLocaleString("id-ID")}
                      </p>
                      {data.JENIS_MAKANAN === "Cake" ? (
                        <p
                          key={harga + 3}
                          className="mx-2 font-poetsen opacity-50 text-lg"
                        >
                          {"/ " + data.LOYANG[indexHarga]}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
                {isLoading ? (
                  <ClipLoader />
                ) : (
                  <>
                    <div key={index}>
                      {dataKuotaProdukToday.map((kuota, indexKuota) => {
                        if(kuota.kuotaProduk !== null){
                          if (kuota.nama_produk === data.NAMA_PRODUK) {
                            return (
                              <div
                                key={`${index}-${indexKuota}-${data.NAMA_PRODUK}`}
                                className="mt-6"
                              >
                                <div className="flex">
                                  <p className="font-poetsen text-lg">Sisa&nbsp;</p>
                                  <p className="font-poetsen font-bold text-lg">
                                    {kuota.kuotaProduk[0]?.KUOTA}
                                  </p>
                                  <p className="font-poetsen text-lg">&nbsp;kuota pre order</p>
                                </div>
                                <p className="font-poetsen opacity-50 italic">
                                  Di update hari ini pukul{" "}
                                  {new Date().toTimeString().split(" ")[0]}
                                </p>
                              </div>
                            );
                          } else {
                            return null; // No key needed for null
                          }
                        } else {
                          return null;
                        }
                      })}
                    </div>

                    <div className="mt-4">
                      {dataKuotaProdukToday.map((kuota, indexKuota) => {
                        if(kuota.kuotaProduk !== null){
                          if (kuota.nama_produk === data.NAMA_PRODUK) {
                            if (kuota.kuotaProduk[0].KUOTA > 0) {
                              return (
                                <DetilProdukPage key={`${index}-${indexKuota}-${data.NAMA_PRODUK}`} produk={data} dateDeliver={queryParams.filter}/>
                              );
                            } else {
                              return (
                                <Button
                                  key={`${index}-${indexKuota}-${data.NAMA_PRODUK}`}
                                  className="bg-blue-500"
                                  disabled
                                >
                                  Pesan Sekarang
                                </Button>
                              );
                            }
                          } else {
                            return null; // No key needed for null
                          }
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreOrderProdukPage;
