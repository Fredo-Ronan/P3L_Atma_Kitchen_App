"use client";
import { removeUrlQueryParams, urlQueryParams } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const LocalSearchBar = ({ route }: { route: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        const newUrl = urlQueryParams({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, {
          scroll: false,
        });
      } else {
        const newUrl = removeUrlQueryParams({
          params: searchParams.toString(),
          key: ["q"],
        });
        router.push(newUrl, {
          scroll: false,
        });
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, pathname, search, searchParams, router]);

  return (
    <div className="flex items-center bg-secondary rounded h-[46px] p-2">
      <Input
        placeholder="Cari data..."
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-r-none w-[300px] border-none bg-transparent"
      />
      <SearchIcon className="text-gray-500" />
    </div>
  );
};

export default LocalSearchBar;
