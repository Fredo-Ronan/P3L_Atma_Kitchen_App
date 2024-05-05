import { KUOTA_HARIAN } from '@/types'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditKuotaHarian from './EditKuotaHarian';
import { isDateEarlier } from '@/utilities/dateCompare';


interface Props {
    data: KUOTA_HARIAN[];
    refreshData: () => void;
}

const TabelKuotaHarian = ({ data, refreshData }: Props) => {
  return (
    <div>
      <Table>
            <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kuota</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((element, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{element.TANGGAL_KUOTA.split("T")[0]}</TableCell>
                            <TableCell className="font-medium">{element.KUOTA}</TableCell>
                            <TableCell className="font-medium">{element.KETERANGAN}</TableCell>
                            <TableCell>
                                <EditKuotaHarian data={element} earlier={isDateEarlier(element.TANGGAL_KUOTA.split("T")[0])} refreshData={refreshData}/>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default TabelKuotaHarian