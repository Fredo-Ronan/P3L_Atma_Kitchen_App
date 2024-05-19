'use client'
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HAMPERS, PRODUK } from "@/types";

interface DETIL_GAMBAR {
    nama_hampers: string;
    gambar_produk: PRODUK[];
}

const HampersCarousel = ({ dataHampers }: { dataHampers: HAMPERS[] }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const [gambar, setGambar] = useState<DETIL_GAMBAR[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getGambar = async () => {
    setIsLoading(true);
    dataHampers.map(async (data, _) => {
        const resGambar = await fetch(`/api/hampers/${data.ID_HAMPERS}`);
        const resFinal = await resGambar.json();

        console.log(`ID HAMPERS : ${data.ID_HAMPERS}`)
        setGambar((prevGambar) => [...prevGambar, { nama_hampers: data.NAMA_HAMPERS, gambar_produk: resFinal.detilHampers }]);
    })

    setIsLoading(false);
  }

  function formatNumber(num: any) {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toString();
  }

  useEffect(() => {
    getGambar();
  }, [])

  return (
    <div>
      <Carousel
        plugins={[plugin.current]}
        className="w-full shadow-xl"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {dataHampers?.map((data, index) => (
            <CarouselItem key={index}>
                {isLoading
                ?
                <Skeleton className="w-full h-96"/>
                :
                <div className="bg-slate-400 relative" key={index}>
                    <img src="/assets/images/banner hampers.png" alt="" />
                    <h1 className="absolute top-36 bottom-0 left-16 right-0 text-5xl font-poetsen font-bold">{data.NAMA_HAMPERS}</h1>
                    <h1 className="absolute top-52 bottom-0 left-16 right-0 text-2xl font-poetsen">{data.DESKRIPSI_HAMPERS.split("+")[0]}</h1>

                    {data.DESKRIPSI_HAMPERS.includes("+ Exclusive") ? 
                        <p className="before:block before:absolute before:-inset-2 before:-skew-y-2 before:w-72 before:h-12 before:-z-40 before:bg-blue-500 before:shadow-lg absolute top-60 bottom-0 left-20 right-0 transform -rotate-6 text-2xl font-poetsen text-white">+ {data.DESKRIPSI_HAMPERS.split("+")[1]}</p>
                        : <></>
                    }
                    
                    <div className="before:block before:absolute before:w-44 before:h-20 before:rounded-full before:-z-40 before:bg-yellow-500 before:shadow-xl absolute -top-40 bottom-0 right-[720px] z-50 flex justify-center items-center transform rotate-6">
                        <p className="text-white text-2xl font-bold font-poetsen">Rp. {formatNumber(data.HARGA_HAMPERS)}</p>
                    </div>

                    <div className="absolute top-0 bottom-0 right-64" key={index}>
                        {gambar.map((dataGambar, index) => (
                            dataGambar.nama_hampers === data.NAMA_HAMPERS ? 
                            dataGambar.gambar_produk.map((gambar, indexGambar) => (
                                indexGambar % 2 === 0 ?
                                <div className="relative transform rotate-6 top-16 shadow-xl group w-[300px]" key={indexGambar}>
                                    <div className="absolute text-black text-center p-2 text-2xl w-full font-bold font-poetsen bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                        {gambar.NAMA_PRODUK}
                                    </div>
                                    <img src={gambar.GAMBAR_PRODUK} className="" alt=""/>
                                </div>
                                :
                                <div className="relative transform -rotate-6 -top-20 right-48 shadow-xl group w-[250px]" key={indexGambar}>
                                    <div className="absolute text-black text-center p-2 text-2xl w-full font-bold font-poetsen bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                        {gambar.NAMA_PRODUK}
                                    </div>
                                    <img src={gambar.GAMBAR_PRODUK} className="" alt=""/>
                                </div>
                            )) : <></>
                        ))}
                    </div>
                </div>
                }
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HampersCarousel;
