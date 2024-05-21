import { Skeleton } from "@/components/ui/skeleton";
import { KUOTA_HARIAN, PRODUK_FOR_CUSTOMER_UI } from "@/types";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";

interface DATA_KUOTA {
  nama_produk: string;
  kuotaProduk: KUOTA_HARIAN[];
}

const PreOrderProdukPage = ({
  dataProdukPreOrder,
}: {
  dataProdukPreOrder: PRODUK_FOR_CUSTOMER_UI[];
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataKuotaProdukToday, setDataKuotaProdukToday] = useState<
    DATA_KUOTA[]
  >([]);

  const fetchKuotaProduk = async () => {
    try {
      const kuotaPromises = dataProdukPreOrder.map(async (data) => {
        if (data.JENIS_PRODUK === "Pre Order") {
          const resKuotaProduk = await fetch(
            `/api/kuotaProduk/${data.ID_PRODUK}`
          );
          if (!resKuotaProduk.ok) {
            throw new Error("Failed to fetch kuota produk");
          }

          const resKuotaProdukFinal = await resKuotaProduk.json();
          return {
            nama_produk: data.NAMA_PRODUK,
            kuotaProduk: resKuotaProdukFinal.kuotaProdukToday,
          };
        }

        return { nama_produk: "", kuotaProduk: null };
      });

      const allDataKuota = await Promise.all(kuotaPromises);
      setDataKuotaProdukToday(allDataKuota);
    //   console.log(allDataKuota);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetch kuota produk " + error);
      throw error;
    }
  };

  useEffect(() => {
    fetchKuotaProduk();
  }, [dataProdukPreOrder]);

  return (
    <div>
      <div className="flex flex-wrap gap-6 justify-center">
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
                        if (kuota.nama_produk === data.NAMA_PRODUK) {
                          return (
                            <div
                              key={`${index}-${indexKuota}-${data.NAMA_PRODUK}`}
                              className="mt-6"
                            >
                              <div className="flex">
                                <p className="font-poetsen text-lg">
                                  Sisa&nbsp;
                                </p>
                                <p className="font-poetsen font-bold text-lg">
                                  {kuota.kuotaProduk[0].KUOTA}
                                </p>
                                <p className="font-poetsen text-lg">
                                  &nbsp;kuota hari ini
                                </p>
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
                      })}
                    </div>

                    <div className="mt-4">
                      {dataKuotaProdukToday.map((kuota, indexKuota) => {
                        if (kuota.nama_produk === data.NAMA_PRODUK) {
                          if (kuota.kuotaProduk[0].KUOTA > 0) {
                            return (
                              <Button
                                key={`${index}-${indexKuota}-${data.NAMA_PRODUK}`}
                                className="bg-blue-500"
                              >
                                Pesan Sekarang
                              </Button>
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
