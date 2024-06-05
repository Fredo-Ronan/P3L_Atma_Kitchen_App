import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BAHAN_BAKU, DETAIL_RESEP, DETIL_TRANSAKSI, PRODUK, TRANSAKSI_PESANAN } from "@/types";
import { Button } from "../ui/button";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { formatDateToYYYYMMDD } from "@/utilities/dateParser";

interface COLLECTION_DETIL_TRANSAKSI {
  id_transaksi: number;
  detil_transaksi: DETIL_TRANSAKSI[];
}

interface COLLECTION_DETIL_RESEP {
    id_transaksi: number;
    detil_resep: DETAIL_RESEP[];
}
  
interface BahanMapItem {
    ID_BAHAN: number;
    NAMA_BAHAN: string;
    JUMLAH_DIBUTUHKAN: number;
    SATUAN: string;
  }
  
  interface BahanMap {
    [key: string]: BahanMapItem;
  }

const TabelPesananHarusDiproses = ({ dataPesanan, dataBahan }: { dataPesanan?: TRANSAKSI_PESANAN[], dataBahan?: BAHAN_BAKU[] }) => {
  const [isPilihSemua, setIsPilihSemua] = useState(false);
  const [detilTiapDataPesanan, setDetilTiapDataPesanan] = useState<COLLECTION_DETIL_TRANSAKSI[]>([]);
  const [detilBahanPerPesanan, setDetilBahanPerPesanan] = useState<COLLECTION_DETIL_RESEP[]>([]);
  const [totalBahanDibutuhkan, setTotalBahanDibutuhkan] = useState<BahanMapItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProses, setIsLoadingProses] = useState(false);
  const [isBahanKurang, setIsBahanKurang] = useState(false);

  const getEachDetailTransaksi = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (!dataPesanan || dataPesanan.length === 0) {
        console.log("No dataPesanan available.");
        return;
      }

      const promises: Promise<COLLECTION_DETIL_TRANSAKSI>[] = [];
      dataPesanan.forEach((data) => {
        promises.push(
          (async () => {
            const resDetilTransaksi = await axios.get(`/api/getDetilTransaksi/${data.ID_TRANSAKSI_PESANAN}`);
            // console.log(resDetilTransaksi.data.dataDetilTransaksi);
            const detilTransaksi: DETIL_TRANSAKSI[] = resDetilTransaksi.data.dataDetilTransaksi;
            return {
              id_transaksi: data.ID_TRANSAKSI_PESANAN,
              detil_transaksi: detilTransaksi,
            };
          })()
        );
      });

      const detilData = await Promise.all(promises);
      setDetilTiapDataPesanan(detilData);
    } catch (error) {
      console.log("Error in getEachDetailTransaksi:", error);
      throw error;
    } finally {
      
    }
  };

  const getDetailBahanPerPesanan = async () => {
    try {
        const promises: Promise<COLLECTION_DETIL_RESEP>[] = [];
        detilTiapDataPesanan.forEach((data) => {
            data.detil_transaksi.forEach((dataDetil) => {
                promises.push(
                    (async () => {
                        const resBahanDibutuhkan = await axios.get(`/api/relasiBahanResep/getCertainDetailResep/${dataDetil.ID_RESEP}`);
                        // console.log(resBahanDibutuhkan.data);
                        const bahanDibutuhan = resBahanDibutuhkan.data.dataBahanDibutuhkan;
                        return {
                            id_transaksi: data.id_transaksi,
                            detil_resep: bahanDibutuhan
                        }
                    })()
                );
            });
        });

        const detilBahanDibutuhkan = await Promise.all(promises);
        const agregated = aggregateBahanDibutuhkan(detilBahanDibutuhkan);
        // console.log(agregated);
        isAdaBahanKurang(agregated);
        setTotalBahanDibutuhkan(agregated);
        setDetilBahanPerPesanan(detilBahanDibutuhkan);
        setIsLoading(false);
    }catch(error){
        console.log(error);
        throw error;
    }
  }

  const aggregateBahanDibutuhkan = (detilBahanPerPesanan: COLLECTION_DETIL_RESEP[]): BahanMapItem[] => {
    const bahanMap: BahanMap = {};
  
    detilBahanPerPesanan.forEach((dataDetil) => {
      dataDetil.detil_resep.forEach((dataBahanDibutuhkan) => {
        if (bahanMap[dataBahanDibutuhkan.NAMA_BAHAN]) {
          bahanMap[dataBahanDibutuhkan.NAMA_BAHAN].JUMLAH_DIBUTUHKAN += dataBahanDibutuhkan.JUMLAH_DIBUTUHKAN;
        } else {
          bahanMap[dataBahanDibutuhkan.NAMA_BAHAN] = { ...dataBahanDibutuhkan };
        }
      });
    });
  
    return Object.values(bahanMap);
  };

  const isAdaBahanKurang = (dataSemuaBahanHariIni: BahanMapItem[]) => {
    dataSemuaBahanHariIni.map((dataBahanToday) => {
        dataBahan?.forEach((dataBahanDB) => {
            if(dataBahanDB.STOK_BAHAN < dataBahanToday.JUMLAH_DIBUTUHKAN && dataBahanDB.NAMA_BAHAN === dataBahanToday.NAMA_BAHAN){
                setIsBahanKurang(true);
            }
        })
    })
  }

  function removeDuplicatesUsingFilter(arr: any[] | undefined): any[] | undefined {
    return arr?.filter((item, index) => arr?.indexOf(item) === index);
  }
  

  const findProdukByIdResep = (idResep: number | null | undefined, indexDetil: number, index: number) => {
    const transaksi = detilTiapDataPesanan.map((data) => {
        data.detil_transaksi.map((dataTransaksi) => {
            if(dataTransaksi.ID_RESEP === idResep){
                return dataTransaksi;
            }
        })

        return data.detil_transaksi;
    })

    // console.log(transaksi);

    const produk = transaksi.at(index)?.map((data) => {
        if(data.ID_RESEP === idResep){
            return data.NAMA_PRODUK;
        }

        return data.NAMA_PRODUK;
    })

    const produkFiltered  = removeDuplicatesUsingFilter(produk);

    // console.log(produk);
    // console.log(produkFiltered)

    return produkFiltered;
  }

  const checkKetersediaanBahan = (namaBahan: string) => {
    let stok;
    
    dataBahan?.map((data) => {
        if(data.NAMA_BAHAN === namaBahan){
            stok = data.STOK_BAHAN;
        }
    })

    // console.log(stok);

    return stok;
  }


  const prosesSemuaTrigger = async () => {

  }

  const prosesPesanan = async (dataTransaksi: TRANSAKSI_PESANAN) => {
    setIsLoadingProses(true);
    try {
      const detilTransaksi = detilTiapDataPesanan.filter((data) => data.id_transaksi === dataTransaksi.ID_TRANSAKSI_PESANAN);

      console.log(detilTransaksi);

      const promises: Promise<COLLECTION_DETIL_RESEP>[] = [];
      detilTransaksi.forEach((data) => {
          data.detil_transaksi.forEach((dataDetil) => {
              promises.push(
                  (async () => {
                      const resBahanDibutuhkan = await axios.get(`/api/relasiBahanResep/getCertainDetailResep/${dataDetil.ID_RESEP}`);
                      // console.log(resBahanDibutuhkan.data);
                      const bahanDibutuhan = resBahanDibutuhkan.data.dataBahanDibutuhkan;
                      return {
                          id_transaksi: data.id_transaksi,
                          detil_resep: bahanDibutuhan
                      }
                  })()
              );
          });
      });

      const detilBahanDibutuhkan = await Promise.all(promises);
      const agregated = aggregateBahanDibutuhkan(detilBahanDibutuhkan);

      // console.log(detilBahanDibutuhkan);
      // console.log(agregated);

      agregated.forEach(async (dataBahan) => {
        const resUpdateStok = await axios.put(`/api/bahanBaku/updateStok`, {
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nama_bahan: dataBahan.NAMA_BAHAN,
            stok_digunakan: dataBahan.JUMLAH_DIBUTUHKAN
          })
        });

        // console.log(resUpdateStok);
      })

      agregated.forEach(async (dataBahan) => {
        console.log(dataBahan.ID_BAHAN);
        const resInsertPenggunaanBahan = await axios.post(`/api/penggunaanBahan`, {
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id_bahan: dataBahan.ID_BAHAN,
            jumlah_digunakan: dataBahan.JUMLAH_DIBUTUHKAN,
            tanggal_digunakan: formatDateToYYYYMMDD(new Date())
          })
        });

        console.log(resInsertPenggunaanBahan);
      })

      const resUpdateStatusPesanan = await axios.put(`/api/transaksiPesanan/updateToProses/${detilTransaksi.at(0)?.id_transaksi}`);

      setIsLoadingProses(false);
      window.location.reload();
    }catch(error){
      console.log(error);
      throw error;
    }
  }
  

  useEffect(() => {
    // console.log("Running useEffect");
    getEachDetailTransaksi();
  }, [dataPesanan]);

  useEffect(() => {
    // console.log("RUNNING USE EFFECT DETAIL BAHAN");
    getDetailBahanPerPesanan();
  }, [detilTiapDataPesanan])

  return (
    <div>
        <div className="flex justify-end items-center mb-6 gap-4">
          {isBahanKurang ?
            <p className="text-red-500 italic">
              Ada bahan yang kurang!
            </p> : <></>
          }
          <Dialog>
              <DialogTrigger asChild>
                  <Button className="bg-blue-500">
                      Lihat Rekap Bahan
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                  <DialogTitle>Rekap Bahan Produksi Hari Ini</DialogTitle>
                  <DialogDescription>
                      {totalBahanDibutuhkan.map((dataBahanDibutuhkan, index) => (
                          <div key={index} className="flex gap-2">
                              <p>{dataBahanDibutuhkan.NAMA_BAHAN} - {dataBahanDibutuhkan.JUMLAH_DIBUTUHKAN} {dataBahanDibutuhkan.SATUAN}</p>
                              <p className={checkKetersediaanBahan(dataBahanDibutuhkan.NAMA_BAHAN)! < dataBahanDibutuhkan.JUMLAH_DIBUTUHKAN ? "text-red-500" : "text-black"}>{checkKetersediaanBahan(dataBahanDibutuhkan.NAMA_BAHAN)! < dataBahanDibutuhkan.JUMLAH_DIBUTUHKAN ? `WARNING: STOK ${checkKetersediaanBahan(dataBahanDibutuhkan.NAMA_BAHAN)} ${dataBahanDibutuhkan.SATUAN}` : ""}</p>
                          </div>
                      ))}
                  </DialogDescription>
                  </DialogHeader>
              </DialogContent>
          </Dialog>

            <Button disabled={isBahanKurang || isLoading} className={isPilihSemua ? "bg-red-500" : "bg-blue-500"} onClick={() => { setIsPilihSemua(!isPilihSemua); }}>
                {isPilihSemua ? "Batal" : "Pilih Semua"}
            </Button>

            {isPilihSemua ?
              <Button className="bg-yellow-500">
                Proses Semua
              </Button> : <></>
            }
        </div>
      <Table>
        <TableCaption>List pesanan harus di proses hari ini</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">No Transaksi</TableHead>
            <TableHead className="w-[150px]">Tanggal Pesanan</TableHead>
            <TableHead className="w-[170px]">Tanggal Pengiriman</TableHead>
            <TableHead>Alamat Pengiriman</TableHead>
            <TableHead className="w-[150px]">Tipe Pengiriman</TableHead>
            <TableHead className="w-[100px]">Total Item</TableHead>
            <TableHead>Status Transaksi</TableHead>
            <TableHead>Detil Transaksi</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPesanan?.map((data, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{data.NO_TRANSAKSI}</TableCell>
              <TableCell>{data.TANGGAL_PESANAN?.split("T")[0]}</TableCell>
              <TableCell>{data.TANGGAL_PENGIRIMAN?.split("T")[0]}</TableCell>
              <TableCell>{data.ALAMAT_PENGIRIMAN}</TableCell>
              <TableCell>{data.TIPE_PENGIRIMAN}</TableCell>
              <TableCell>{data.TOTAL_ITEM}</TableCell>
              <TableCell>{data.STATUS_TRANSAKSI}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    {isLoading ?
                        <ClipLoader/> :
                        <p className="text-blue-500 underline hover:cursor-pointer">Detil Bahan Produk</p>
                    }
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detil Bahan Produk</DialogTitle>
                      <DialogDescription>
                        {detilBahanPerPesanan.map((dataDetil, indexDetil) => {
                          if (data.ID_TRANSAKSI_PESANAN === dataDetil.id_transaksi) {
                            return (
                              <div key={indexDetil} className="mb-6">
                                <p className="text-lg">{findProdukByIdResep(dataDetil.detil_resep.at(indexDetil)?.ID_RESEP, indexDetil, index)}</p>
                                {dataDetil.detil_resep.map((dataBahanDibutuhkan, indexBahan) => (
                                    <p key={indexBahan}>{dataBahanDibutuhkan.NAMA_BAHAN} - {dataBahanDibutuhkan.JUMLAH_DIBUTUHKAN} {dataBahanDibutuhkan.SATUAN}</p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Button disabled={isPilihSemua || isLoading || isBahanKurang} className={isPilihSemua ? "bg-green-500" : "bg-yellow-500"} onClick={() => {prosesPesanan(data)}}>
                  {isPilihSemua ? "Terpilih" : isLoadingProses ? <ClipLoader color="#ffffff"/> : "Proses"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TabelPesananHarusDiproses;
