import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { HAMPERS } from '@/types';
import DeleteBtn from './DeleteBtn';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import EditHampersOnly from './EditHampersOnly';

interface Props {
    data: HAMPERS[];
    refreshData: () => void;
    deleteData: (id: number) => void;
}

interface LoadingItems {
    data: HAMPERS;
    state: boolean;
}

const TableHampers = ({ data, refreshData, deleteData }: Props) => {

    const [isLoading, setIsLoading] = useState<LoadingItems[]>(
        data.map((element):LoadingItems => { 
            return { 
                data: element, 
                state: false 
            }; 
        })
    );

    const updateIsLoadingAtIndex = (index: number, newValue: boolean) => {
        // Create a copy of the array
        const newIsLoading = [...isLoading];
        // Update the value at the specified index
        newIsLoading[index] = {
            data: newIsLoading[index].data,
            state: newValue
        };
        // Update the state with the new array
        setIsLoading(newIsLoading);
    };

  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Hampers</TableHead>
                <TableHead>Harga Hampers</TableHead>
                <TableHead>Deskripsi Hampers</TableHead>
                <TableHead>Detail Hampers</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((element, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{element.NAMA_HAMPERS}</TableCell>
                            <TableCell className="font-medium">{element.HARGA_HAMPERS}</TableCell>
                            <TableCell className="font-medium">{element.DESKRIPSI_HAMPERS}</TableCell>
                            <TableCell className="font-medium">
                                <Link href={`/adminView/hampers/${element.NAMA_HAMPERS}/${element.ID_HAMPERS}`} className='underline text-blue-500' onClick={() => updateIsLoadingAtIndex(index, true)}>
                                    {isLoading[index].state ? <ClipLoader size={20} color='#2563eb'/> : "Lihat Detail Hampers"}
                                </Link>
                            </TableCell>
                            <TableCell className='flex gap-3 justify-start'>
                                <EditHampersOnly refreshData={refreshData} data={element}/>
                                <DeleteBtn hapusData={deleteData} id={element.ID_HAMPERS}/>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default TableHampers