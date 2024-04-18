import CreateBahanBaku from "@/components/admin/CreateBahanBaku";
import Filter from "@/components/admin/Filter";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bahanBakuTable, satuanFilter } from "@/constants/mapping";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold">Bahan Baku</h1>
      <div className="flex items-center justify-between my-10">
        <Filter filter={satuanFilter} />
        <CreateBahanBaku />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {bahanBakuTable.map((item: string) => (
              <TableHead key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
};

export default Page;
