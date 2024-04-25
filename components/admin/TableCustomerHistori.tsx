import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableCustomerHistori } from "@/constants/mapping";
import { CustomerHistori } from "@/types";
import NotFound from "../shared/NotFound";
import Link from "next/link";

interface Props {
  data: CustomerHistori[];
}

const TableCustomerHistori = ({ data }: Props) => {
  if (data.length === 0) {
    return <NotFound />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableCustomerHistori.map((item: string) => (
            <TableHead key={item}>{item}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: CustomerHistori) => (
          <TableRow key={item.ID_CUSTOMER}>
            <TableCell>{item.ID_CUSTOMER}</TableCell>
            <TableCell>{item.NAMA_CUSTOMER}</TableCell>
            <TableCell>{item.EMAIL_CUSTOMER}</TableCell>
            <TableCell>
              <Link
                href={`/adminView/historiPesananCustomer/${item.ID_CUSTOMER}`}
                className="text-blue-500"
              >
                Lihat Histori
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCustomerHistori;
