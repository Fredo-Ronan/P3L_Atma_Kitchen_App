"use client";
import ReadyProdukPage from "@/components/customer/produkComponents/ReadyProdukPage";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUK } from "@/types";
import React, { useEffect, useState } from "react";

const ProdukReadyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataProdukReady, setDataProdukReady] = useState<PRODUK[]>([]);
  const skeletonArray = new Array(7).fill(null);

  const fetchDataProdukReady = async () => {
    setIsLoading(true);
    const resDataProdukReady = await fetch(`/api/produk/getAllReadyStock`);

    const resFinalDataProdukReady = await resDataProdukReady.json();

    setDataProdukReady(resFinalDataProdukReady.produkReadyStock);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataProdukReady();
  }, []);

  return (
    <div className="font-poetsen px-16">
      <h1 className="text-2xl font-bold mt-4 mb-7">Ready Stock</h1>
      {isLoading ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {skeletonArray.map((_, index) => (
            <div className="w-72" key={index}>
              <Card>
                <CardContent className="py-6">
                  <div className="flex justify-center">
                    <div className="relative w-full h-52">
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="my-2 w-3/4 h-8" />
                    <Skeleton className="w-1/2 h-6" />
                  </div>
                  <div className="mt-6">
                    <Skeleton className="w-1/2 h-6" />
                    <Skeleton className="w-1/3 h-6 mt-2" />
                  </div>
                  <div className="mt-4">
                    <Skeleton className="w-full h-10" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <ReadyProdukPage dataProdukReady={dataProdukReady} />
      )}
    </div>
  );
};

export default ProdukReadyPage;
