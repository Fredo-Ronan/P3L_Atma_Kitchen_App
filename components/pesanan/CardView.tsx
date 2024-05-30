"use client";
import { formatTanggal } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { ClipLoader } from "react-spinners";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Image,
  Loader2,
  MousePointerSquareDashed,
} from "lucide-react";
import Dropzone, { FileRejection } from "react-dropzone";
import { Progress } from "../ui/progress";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { Button } from "../ui/button";
import { invoiceMaker } from "@/utilities/invoiceMaker";
import { HAMPERS, HAMPERS_FOR_KERANJANG, PRODUK, PRODUK_FOR_KERANJANG } from "@/types";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

interface Props {
  data: any;
}

const CardView = ({ data }: Props) => {
  const [isLoading, setisLoading] = useState(false);
  const [pesanan, setPesanan] = useState([]);

  const fetchPesanan = async () => {
    setisLoading(true);
    try {
      const response = await fetch(`/api/pesananBelumBayar/${data.id_customer}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { pesanan } = await response.json();

      setPesanan(pesanan);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  console.log(pesanan);
  return isLoading ? (
    <div className="min-h-[70vh] flex items-center justify-center">
      <ClipLoader size={60} />
    </div>
  ) : (
    <div className="flex flex-col space-y-8 py-12">
      {pesanan.map((item: any) => (
        <Card item={item} nama_customer={data.nama_customer} key={item.ID_TRANSAKSI_PESANAN} />
      ))}
    </div>
  );
};

interface TransaksiDetail {
  ID_PRODUK: number;
  ID_HAMPERS: number;
}

const Card = ({ item, nama_customer }: any) => {
  const [detilProduk, setDetilProduk] = useState<PRODUK_FOR_KERANJANG[]>([]);
  const [detilHampers, setDetilHampers] = useState<HAMPERS_FOR_KERANJANG[]>([]);
  const [detilTransaksi, setDetilTransaksi] = useState<TransaksiDetail[]>([]);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  const getDetilTransaksi = async () => {
    setIsLoadingInvoice(true);
    try {
      const resGetDetilTransaksi = await axios.get<{ dataDetilTransaksi: TransaksiDetail[] }>(
        `/api/getDetilTransaksi/${item.ID_TRANSAKSI_PESANAN}`
      );
      const dataDetilTransaksi = resGetDetilTransaksi.data.dataDetilTransaksi;
      setDetilTransaksi(dataDetilTransaksi);

      const produkPromises = dataDetilTransaksi.map(data =>
        axios
          .get<{ dataProduk: PRODUK[] }>(`/api/produk/getAllColumn/${data.ID_PRODUK}`)
          .then(res => res.data.dataProduk[0])
      );

      const hampersPromises = dataDetilTransaksi.map(data =>
        axios
          .get<{ hampers: HAMPERS[] }>(`/api/hampers/${data.ID_HAMPERS}`)
          .then(res => res.data.hampers[0])
      );

      const produkResults = await Promise.all(produkPromises);
      const hampersResults = await Promise.all(hampersPromises);

      const allProdukData: PRODUK_FOR_KERANJANG[] = produkResults.filter(Boolean).map(produk => ({
        ID_PRODUK: produk.ID_PRODUK,
        DESKRIPSI_PRODUK: produk.DESKRIPSI_PRODUK,
        GAMBAR_PRODUK: produk.GAMBAR_PRODUK,
        HARGA_PRODUK: produk.HARGA_PRODUK,
        JENIS_MAKANAN: produk.JENIS_MAKANAN,
        JENIS_PRODUK: produk.JENIS_PRODUK,
        LOYANG: produk.LOYANG,
        NAMA_PRODUK: produk.NAMA_PRODUK,
        STATUS_PRODUK: produk.STATUS_PRODUK,
        STOK: produk.STOK,
        TANGGAL_PENGIRIMAN: ""
      }));

      const allHampersData: HAMPERS_FOR_KERANJANG[] = hampersResults.filter(Boolean).map(hampers => ({
        ID_HAMPERS: hampers.ID_HAMPERS,
        NAMA_HAMPERS: hampers.NAMA_HAMPERS,
        DESKRIPSI_HAMPERS: hampers.DESKRIPSI_HAMPERS,
        HARGA_HAMPERS: hampers.HARGA_HAMPERS,
        TANGGAL_PENGIRIMAN: ""
      }));

      setDetilProduk(allProdukData);
      setDetilHampers(allHampersData);

      setIsLoadingInvoice(false);
    }catch(error){
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    getDetilTransaksi();
  }, [item, nama_customer]);

  return (
    <div className="w-full p-8 shadow-sm border rounded-2xl flex flex-col space-y-2">
      <span>
        Tanggal transaksi:{" "}
        <span className="font-semibold">
          {formatTanggal(item.TANGGAL_PESANAN)}
        </span>{" "}
      </span>
      <div className="flex items-center gap-2">
        <span className="items-center gap-2 ">
          Status pesanan:{" "}
          <Badge
            variant="secondary"
            className="font-semibold inline-block text-orange-600"
          >
            {item.STATUS_PESANAN}
          </Badge>
        </span>
        <span className="items-center gap-2">
          Status transaksi:{" "}
          <Badge
            variant="secondary"
            className="font-semibold inline-block items-center  text-blue-600"
          >
            {item.STATUS_TRANSAKSI}
          </Badge>
        </span>
      </div>
      <div className="space-y-3">
        <p>
          Nomor transaksi:{" "}
          <span className="font-semibold">{item.NO_TRANSAKSI}</span>
        </p>
        {item.ALAMAT_PENGIRIMAN && (
          <p>
            Alamat pengiriman:{" "}
            <span className="font-semibold">{item.ALAMAT_PENGIRIMAN}</span>
          </p>
        )}
        <p>
          Tipe pengiriman:{" "}
          <span className="font-semibold">
            <Badge variant="outline">{item.TIPE_PENGIRIMAN}</Badge>
          </span>
        </p>
        <p>
          Total item: <span className="font-semibold">{item.TOTAL_ITEM}</span>
        </p>
        <p>
          Total harga: <span className="font-semibold">{item.TOTAL_HARUS_DIBAYAR}</span>
        </p>
      </div>
      <div className="flex justify-between">
        <Bayar item={item} />
        <Button disabled={isLoadingInvoice} onClick={() => {
          invoiceMaker(item.NO_TRANSAKSI, item.TANGGAL_PESANAN.split("T")[0], item.TANGGAL_PENGIRIMAN.split("T")[0], nama_customer, item.ALAMAT_PENGIRIMAN, item.TIPE_PENGIRIMAN, detilProduk, detilHampers, item.TOTAL_HARUS_DIBAYAR, 0, item.POIN, "", item.ONGKIR)
        }}>{isLoadingInvoice ? <ClipLoader color="#ffffff"/> : "Download Invoice"}</Button>
      </div>
    </div>
  );
};

const Bayar = ({ item }: any) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async ([data]) => {
      await axios.put(`/api/pesananBelumBayar/${item.ID_TRANSAKSI_PESANAN}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bukti_tf: data.serverData.fileUrl,
        }),
      });
      toast({
        title: "Upload success",
        description: "Redirecting to your confirmation page...",
      });
      startTransition(() => {
        router.push(`/pesanan/${item.ID_TRANSAKSI_PESANAN}`);
      });
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);

    toast({
      title: `${file.file.type} type is not supported.`,
      description: "Please upload a PNG, JPG, or JPEG file.",
      variant: "destructive",
    });
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    await startUpload(acceptedFiles);

    setIsDragOver(false);
  };

  return (
    <Dialog>
      <DialogTrigger className="w-fit bg-zinc-700 px-5 py-2 rounded text-white mt-4 self-end  flex items-center ">
        Bayar sekarang <ArrowRight className="text-white w-5 h-5 ml-3" />
      </DialogTrigger>
      <DialogContent className="w-3/4">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
          <DialogDescription>
            Berikut adalah detail transaksi yang perlu dibayar
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          {item.DETIL_TRANSAKSI.map((detil: any) => {
            // console.log(detil);
            return (
              <div
                className="flex flex-col justify-center gap-4"
                key={detil.ID_DETIL_TRANSAKSI}
              >
                <div className="flex items-center gap-6">
                  <div className="border p-2 shadow-sm rounded-lg">
                    <img
                      src={detil.PRODUK[0].GAMBAR_PRODUK}
                      alt=""
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <DialogTitle>{detil.PRODUK[0].NAMA_PRODUK}</DialogTitle>
                    <DialogDescription className="text-balance truncate">
                      {detil.PRODUK[0].DESKRIPSI_PRODUK}
                    </DialogDescription>
                    <DialogDescription>
                      Jumlah: {detil.JUMLAH_PESANAN}
                    </DialogDescription>
                    <DialogDescription>
                      Harga: Rp.{detil.PRODUK[0].HARGA_PRODUK}
                    </DialogDescription>
                    <DialogDescription className="font-semibold">
                      Subtotal: Rp.{detil.SUBTOTAL}
                    </DialogDescription>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-full items-end gap-2 mt-6">
          <DialogTitle className="mt-4 self-end">Total Pembayaran</DialogTitle>
          <DialogDescription className="font-semibold">
            Rp.{item.TOTAL_HARGA}
          </DialogDescription>
        </div>
        <p className="mt-10 text-xs">
          <span className="text-red-500">PENTING!</span> masukkan bukti transfer
          ke bank BCA berikut: <span className="font-semibold">3580634540</span>
        </p>
        <div className="relative flex flex-col flex-1 items-center justify-center w-full border border-dashed h-48">
          <Dropzone
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="h-full w-full flex-1 flex flex-col items-center justify-center"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragOver ? (
                  <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
                ) : isPending || isUploading ? (
                  <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
                ) : (
                  <Image className="h-6 w-6 text-zinc-500 mb-2" />
                )}
                <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <p>Uploading...</p>
                      <Progress value={uploadProgress} />
                    </div>
                  ) : isPending ? (
                    <div className="flex flex-col items-center">
                      <p>Redirection, please wait...</p>
                    </div>
                  ) : isDragOver ? (
                    <p>
                      <span className="font-semibold"> Drop File</span> to
                      upload
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold ">Click to upload</span> or
                      drag and drop
                    </p>
                  )}
                </div>
                {isPending ? null : (
                  <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardView;
