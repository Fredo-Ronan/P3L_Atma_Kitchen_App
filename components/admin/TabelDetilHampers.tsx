import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PRODUK } from '@/types';

interface Props {
    data: PRODUK[];
}

const TableDetilHampers = ({ data }: Props) => {

  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Harga Produk</TableHead>
                <TableHead>Loyang</TableHead>
                <TableHead>Gambar Produk</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((element, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{element.NAMA_PRODUK}</TableCell>
                            <TableCell className="font-medium">{element.HARGA_PRODUK}</TableCell>
                            <TableCell className="font-medium">{element.LOYANG}</TableCell>
                            <TableCell className="font-medium">
                                <img src={element.GAMBAR_PRODUK} width={200} height={200} alt="" />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default TableDetilHampers