import React from 'react'
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from 'next/image';
import { PRODUK } from '@/types';
import CreateEditProduk from './CreateEditProduk';
import DeleteBtn from './DeleteBtn';

interface Props {
    data: PRODUK[];
    refreshData: () => void;
    deleteData: (id: number) => void
}

const TableProduk = ({ data, refreshData, deleteData }: Props) => {
  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Harga Produk</TableHead>
                <TableHead>Deskripsi Produk</TableHead>
                <TableHead>Status Produk</TableHead>
                <TableHead>Jenis Produk</TableHead>
                <TableHead>Gambar Produk</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((element, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{element.NAMA_PRODUK}</TableCell>
                            <TableCell>Rp {element.HARGA_PRODUK}</TableCell>
                            <TableCell>{element.DESKRIPSI_PRODUK}</TableCell>
                            <TableCell>
                                <Badge variant={element.STATUS_PRODUK === "Kosong" ? "destructive" : "default"}>{element.STATUS_PRODUK}</Badge>
                            </TableCell>
                            <TableCell>{element.JENIS_PRODUK}</TableCell>
                            <TableCell className='w-min'>
                                <img src={element.GAMBAR_PRODUK} width={200} height={200} alt="" />
                            </TableCell>
                            <TableCell className='flex gap-3 justify-center'>
                                {/* Action Side */}
                                <CreateEditProduk data={element} refreshData={refreshData}/>
                                <DeleteBtn hapusData={deleteData} id={element.ID_PRODUK}/>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default TableProduk