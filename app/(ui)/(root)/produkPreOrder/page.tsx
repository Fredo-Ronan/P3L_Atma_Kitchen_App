"use client";
import PreOrderProdukPage from "@/components/customer/produkComponents/PreOrderProdukPage";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUK_FOR_CUSTOMER_UI, QueryParams } from "@/types";
import { mergeDuplicates } from "@/utilities/mergeProdukPreorder";
import React, { useEffect, useState } from "react";

const ProdukPreOrderPage = ({ searchParams }: { searchParams: QueryParams }) => {
  const [dataProdukPreOrder, setDataProdukPreOrder] = useState<
    PRODUK_FOR_CUSTOMER_UI[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const skeletonArray = new Array(7).fill(null);

  const fetchDataProdukPreOrder = async () => {
    setIsLoading(true);
    const resDataProdukPreOrder = await fetch(`/api/produk/getAllPreOrder`);

    const resFinalProdukPreOrder = await resDataProdukPreOrder.json();

    const merged = mergeDuplicates(resFinalProdukPreOrder.dataProdukPreorder);

    setDataProdukPreOrder(merged);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataProdukPreOrder();
  }, []);

  return (
    <div className="font-poetsen px-16">
      <h1 className="text-2xl font-bold mt-4 mb-7">Pre Order</h1>
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
        <PreOrderProdukPage dataProdukPreOrder={dataProdukPreOrder} searchParams={searchParams}/>
      )}
    </div>
  );
};

export default ProdukPreOrderPage;
