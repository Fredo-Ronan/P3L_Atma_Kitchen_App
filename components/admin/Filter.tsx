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
}

const Filter = ({ filter }: Props) => {
  const searchParams = useSearchParams();

  const query = searchParams.get("filter");

  const [selectedFilter, setSelectedFilter] = useState(query || "all");

  const router = useRouter();

  useEffect(() => {
    if (selectedFilter !== "all") {
      const newUrl = urlQueryParams({
        params: searchParams.toString(),
        key: "filter",
        value: selectedFilter,
      });
      router.push(newUrl, {
        scroll: false,
      });
    } else {
      const newUrl = removeUrlQueryParams({
        params: searchParams.toString(),
        key: ["filter"],
      });
      router.push(newUrl, {
        scroll: false,
      });
    }
  }, [query, selectedFilter, router, searchParams]);

  return (
    <Select
      onValueChange={(content) => setSelectedFilter(content)}
      defaultValue={selectedFilter}
    >
      <SelectTrigger className="w-[180px] h-[46px]">
        <SelectValue placeholder="Select a filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {filter.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Filter;
