/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { ClipLoader } from "react-spinners";

interface Props {
  params: { id: string };
}

const Page = ({ params }: { params: { id: string } }) => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const router = useRouter();

  const fetchResponse = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/api/konfirmasiPesananBelumBayar/${params.id}`
      );
      const { pesanan } = res.data;
      setData(pesanan);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponse();
  }, []);

  console.log(data);

  const onCancel = async () => {
    try {
      await axios.post(`/api/konfirmasiPesananBelumBayar/${params.id}`);
      router.push("/pesanan");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      await axios.put(`/api/konfirmasiPesananBelumBayar/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bukti_tf: data[0].BUKTI_TF,
        }),
      });
      setIsConfirm(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] max-w-[1440px] mx-auto flex justify-center items-center">
        <ClipLoader size={60} />
      </div>
    );
  }

  if (!data || !data[0]?.BUKTI_TF) {
    return (
      <div className="min-h-[70vh] max-w-[1440px] mx-auto flex justify-center items-center">
        <h1 className="text-5xl text-zinc-900 font-bold">
          404 Pesanan Tidak Di Temukan 🥲
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] max-w-[1440px] mx-auto flex justify-center items-center">
      {isConfirm ? (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            tweenDuration={2000}
          />
          <h1 className="text-5xl text-green-600 font-bold">
            Terima kasih, pesanan akan di konfirmasi 🎉
          </h1>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-center text-4xl text-zinc-800 font-bold">
            Berikut Rincian Pembayaran
          </h1>
          <img
            src={data[0].BUKTI_TF}
            alt="bukti_tf"
            className="w-80 h-80 rounded-xl"
          />
          <h2 className="text-2xl text-zinc-800 font-bold">
            Total pembayaran: Rp.{" "}
            <span className="text-white bg-green-600 p-0.5">
              {data[0].TOTAL_HARGA}
            </span>
          </h2>
          <div className="flex items-center gap-6">
            <Button variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-600/75"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
