import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold">Bahan Baku</h1>
      <div className="flex items-center justify-between my-10">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12  w-[300px]" />
          <Skeleton className="h-12  w-[200px]" />
        </div>
        <Skeleton className="h-12  w-[200px]" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-12  w-full" />
        <Skeleton className="h-12  w-full" />
        <Skeleton className="h-12  w-full" />
        <Skeleton className="h-12  w-full" />
        <Skeleton className="h-12  w-full" />
      </div>
      <div className="flex items-center justify-center mt-4">
        <Skeleton className="h-12  w-[200px]" />
      </div>
    </div>
  );
};

export default Loading;
