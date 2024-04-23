"use client";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, removeUrlQueryParams, urlQueryParams } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
  totalPage: number;
  currentPage: number;
  totalContent: number;
}

const Pagination = ({ totalPage, currentPage, totalContent }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limitPage = Math.ceil(totalContent / totalPage);
  const handlePage = (page: number) => {
    const newUrl = urlQueryParams({
      params: searchParams.toString(),
      key: "page",
      value: String(page),
      removePage: false
    });
    router.push(newUrl, {
      scroll: false,
    });
  };

  return (
    <div
      className={cn(`flex items-center gap-3 `, {
        hidden: limitPage <= 1,
      })}
    >
      <Button
        variant="secondary"
        className="text-gray-500"
        disabled={currentPage === 1}
        onClick={() => handlePage(currentPage - 1)}
      >
        <ChevronLeft />
      </Button>
      <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
        {currentPage}
      </p>
      <Button
        variant="secondary"
        disabled={currentPage === limitPage}
        onClick={() => handlePage(currentPage + 1)}
      >
        <ChevronRight className="text-gray-500" />
      </Button>
    </div>
  );
};

export default Pagination;
