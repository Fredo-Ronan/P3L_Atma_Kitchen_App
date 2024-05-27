"use client";
import HampersCarousel from "@/components/customer/homeComponents/HampersCarousel";
import ProdukPreorderCarousel from "@/components/customer/homeComponents/ProdukPreorderCarousel";
import ProdukReadyCarousel from "@/components/customer/homeComponents/ProdukReadyCarousel";
import { HAMPERS, PRODUK, PRODUK_FOR_CUSTOMER_UI } from "@/types";
import { mergeDuplicates } from "@/utilities/mergeProdukPreorder";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const CustomerHomePage = () => {
  // console.log("Data Fetched from customer home page");
  // console.log(JSON.parse(userData!));

  const [dataHampers, setDataHampers] = useState<HAMPERS[]>([]);
  const [dataProdukPreorder, setDataProdukPreorder] = useState<
    PRODUK_FOR_CUSTOMER_UI[]
  >([]);
  const [dataProdukReady, setDataProdukReady] = useState<PRODUK[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataHampers = async () => {
    setIsLoading(true);
    const resDataHampers = await fetch(`/api/hampers`);

    const resFinal = await resDataHampers.json();

    // console.log(resFinal.dataHampers);

    // resDataHampers.data.dataHampers.forEach((element: any) => {
    //     console.log(element);
    // })

    setDataHampers(resFinal.dataHampers);

    // console.log(dataHampers);
  };

  const fetchDataProdukPreorder = async () => {
    const resDataProdukPreorder = await fetch(`/api/produk/getPreOrder`);

    const resFinalProdukPreorder = await resDataProdukPreorder.json();

    // console.log(resFinalProdukPreorder.dataProdukPreorder);

    const merged = mergeDuplicates(resFinalProdukPreorder.dataProdukPreorder);
    // console.log(merged);

    setDataProdukPreorder(merged);
  };

  const fetchDataProdukReadyStock = async () => {
    const resDataProdukReadyStock = await fetch(`/api/produk/getReadyStock`);

    const resFinalProdukReadyStock = await resDataProdukReadyStock.json();

    // console.log(resFinalProdukReadyStock.produkReadyStock);

    setDataProdukReady(resFinalProdukReadyStock.produkReadyStock);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataHampers();
    fetchDataProdukPreorder();
    fetchDataProdukReadyStock();
  }, []);

  return (
    <div>
      <div className="mx-40">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={60} />
          </div>
        ) : (
          <div className="font-poetsen">
            <div className="flex items-center gap-2">
              <h1 className="text-xl mb-2 font-poetsen">Paket Hampers |</h1>
              <a
                href="/hampers"
                className="text-xl mb-2 font-bold relative before:absolute before:inset-0 before:transition-all before:duration-300 duration-300 transition-all before:w-0 hover:before:w-full hover:text-white before:-z-10 hover:before:bg-blue-500"
              >
                Lihat Semua
              </a>
            </div>
            <HampersCarousel dataHampers={dataHampers} />
            <div className="h-20"></div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl mb-2 font-poetsen">Pre Order |</h1>
              <a
                href="/produkPreOrder"
                className="text-xl mb-2 font-bold relative before:absolute before:inset-0 before:transition-all before:duration-300 duration-300 transition-all before:w-0 hover:before:w-full hover:text-white before:-z-10 hover:before:bg-blue-500"
              >
                Lihat Semua
              </a>
            </div>
            <ProdukPreorderCarousel dataProdukPreorder={dataProdukPreorder} />
            <div className="h-20"></div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl mb-2 font-poetsen">Ready Stock</h1>
              <a
                href="/produkReady"
                className="text-xl mb-2 font-bold relative before:absolute before:inset-0 before:transition-all before:duration-300 duration-300 transition-all before:w-0 hover:before:w-full hover:text-white before:-z-10 hover:before:bg-blue-500"
              >
                Lihat Semua
              </a>
            </div>
            <ProdukReadyCarousel dataProdukReady={dataProdukReady} />
          </div>
        )}
      </div>
      <div className="p-20 bg-slate-200 mt-20 space-y-10">
        <h2 className="text-4xl text-center font-bold ">About Atma Kitchen</h2>
        <p className="text-balance text-center text-lg text-gray-600 tracking-wide leading-7">
          <span className="font-semibold text-blue-500">Atma Kitchen</span>{" "}
          adalah toko kue yang mengutamakan kualitas dan rasa dalam setiap
          produknya. Kami menyediakan berbagai layanan untuk memenuhi kebutuhan
          Anda, mulai dari preorder, ready stock, hingga hampers yang cantik dan
          lezat untuk berbagai kesempatan spesial.{" "}
          <span className="bg-zinc-800 text-white p-0.5">Preorder Layanan</span>
          , preorder kami memungkinkan Anda untuk memesan kue dengan desain dan
          rasa yang khusus sesuai dengan keinginan Anda. Pesanan akan
          dipersiapkan dengan penuh perhatian dan ketelitian untuk memastikan
          setiap detailnya sempurna.{" "}
          <span className="bg-zinc-800 text-white p-0.5">Ready Stock</span>,
          kami juga memiliki berbagai pilihan kue yang siap dibawa pulang kapan
          saja. Dengan ready stock, Anda bisa mendapatkan kue-kue segar tanpa
          harus menunggu lama. Pilihan ini sangat ideal untuk kejutan dadakan
          atau kebutuhan mendesak.{" "}
          <span className="bg-zinc-800 text-white p-0.5">
            Hampers Atma Kitchen
          </span>{" "}
          menawarkan hampers eksklusif yang cocok untuk hadiah atau perayaan
          spesial. Setiap hampers disusun dengan hati-hati, berisi berbagai kue
          pilihan yang dijamin memanjakan lidah. Kami memastikan setiap paket
          tampil menarik dan berkesan. Di Atma Kitchen, kami berkomitmen untuk
          memberikan yang terbaik bagi pelanggan kami dengan menggunakan
          bahan-bahan berkualitas tinggi dan resep yang sudah teruji.{" "}
          <span className="bg-zinc-800 text-white p-0.5">
            Kepuasan Anda adalah prioritas utama kami
          </span>
          . Terima kasih telah mempercayakan kebutuhan kue Anda kepada kami.
        </p>

        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <div className="flex gap-0.5 w-full justify-center items-center">
            <Star className="h-5 w-5 fill-green-600 text-green-600" />
            <Star className="h-5 w-5 fill-green-600 text-green-600" />
            <Star className="h-5 w-5 fill-green-600 text-green-600" />
            <Star className="h-5 w-5 fill-green-600 text-green-600" />
            <Star className="h-5 w-5 fill-green-600 text-green-600" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center -space-x-4">
              <img
                src="/assets/images/users/user-1.png"
                alt="user"
                className="rounded-full ring-2 ring-slate-100 inline-block h-10 w-10"
              />
              <img
                src="/assets/images/users/user-2.png"
                alt="user"
                className="rounded-full ring-2 ring-slate-100 inline-block h-10 w-10"
              />
              <img
                src="/assets/images/users/user-3.png"
                alt="user"
                className="rounded-full ring-2 ring-slate-100 inline-block h-10 w-10"
              />
              <img
                src="/assets/images/users/user-4.jpg"
                alt="user"
                className="rounded-full ring-2 ring-slate-100 inline-block h-10 w-10"
              />
              <img
                src="/assets/images/users/user-5.jpg"
                alt="user"
                className="rounded-full ring-2 ring-slate-100 inline-block h-10 w-10"
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">10k+ Happy Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHomePage;
