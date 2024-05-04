'use client';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkResetKuotaProduk = async () => {
    setIsLoading(true);
    const res = await fetch(`${process.env.BASE_URL}/api/resetKuotaHarian/1`);
    setIsLoading(false);
  }

  useEffect(() => {
    checkResetKuotaProduk();
  }, [checkResetKuotaProduk])

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