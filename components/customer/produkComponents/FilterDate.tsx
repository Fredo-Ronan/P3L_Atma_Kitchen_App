"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { removeUrlQueryParams, urlQueryParams } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  filter: string[];
  selectedDate?: string;
}

const FilterDate = ({ filter, selectedDate }: Props) => {
  const searchParams = useSearchParams();

  const query = searchParams.get("filter");

  const [selectedFilter, setSelectedFilter] = useState(query || selectedDate || "today");

  const router = useRouter();

  useEffect(() => {
    if (selectedFilter !== "today") {
      const newUrl = urlQueryParams({
        params: searchParams.toString(),
        key: "filter",
        value: selectedFilter!,
        removePage: true,
      });
      router.push(newUrl, {
        scroll: false,
      });
      // window.location.reload();
    } else {
      const newUrl = removeUrlQueryParams({
        params: searchParams.toString(),
        key: ["filter"],
      });
      router.push(newUrl, {
        scroll: false,
      });
      // window.location.reload();
    }
  }, [query, selectedFilter, router, searchParams]);

  return (
    <div>
      {selectedFilter === "today" ?
      <div className="font-poetsen italic text-red-500">Silahkan pilih tanggal pengiriman untuk mengetahui kuota pre order dan melakukan pre order</div>
      : <></>
      }
      <Select
        onValueChange={(content) => setSelectedFilter(content)}
        defaultValue={selectedFilter}
      >
        <SelectTrigger className="w-[180px] h-[46px]">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Select Date</SelectItem>
          {filter.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterDate;
