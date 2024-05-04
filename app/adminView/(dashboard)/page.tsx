'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkResetKuotaProduk = async () => {
    setIsLoading(true);
    const resCheckTanggal = await fetch(`/api/resetKuotaHarian/checkTanggal/1`);

    const finalResCheckTanggal = await resCheckTanggal.json();
    
    if(finalResCheckTanggal.isSame === true){
      // brarti reset kuota harian semua produk

      // pertama delete all kuota harian
      const resDeleteAll = await fetch(`/api/resetKuotaHarian/deleteAll`, {
        method: "DELETE"
      })

      // kedua alter semua id auto increment menjadi balik ke 1 untuk tabel KUOTA_HARIAN
      const resAlterTable = await fetch(`/api/resetKuotaHarian/alterId/1`);

      // get all id produk
      const resArrayIdProduk = await fetch(`/api/resetKuotaHarian/getAllProdukId/1`);
      const finalArrayIdProduk = await resArrayIdProduk.json();
      const arrayIdProduk = finalArrayIdProduk.data

      const resReset = await axios.post("/api/resetKuotaHarian/reset", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arrayOfIdProduk: arrayIdProduk
        }),
      });

      const nextTanggalReset = resReset.data.tanggalNextUpdate.split("T")[0];

      const resUpdateTanggalReset = await axios.post("/api/resetKuotaHarian/updateTanggalLast", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tanggalNextUpdate: nextTanggalReset
        }),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    checkResetKuotaProduk();
  }, [])

  return (
    <div>
      {
        isLoading ? <div className='flex justify-center items-center'>
          <ClipLoader/>
        </div> : <>Page</>
      }
    </div>
  )
}

export default Page