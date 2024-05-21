import { getItemsFromKeranjang } from '@/actions/getItemFromKeranjang.actions'
import { PRODUK } from '@/types';
import React, { useEffect, useState } from 'react'

const Keranjang = () => {
    const [items, setItems] = useState<PRODUK[]>([]);

    const fetchFromKeranjang = async () => {
        const keranjang = await getItemsFromKeranjang();
        setItems(keranjang);
        console.log(keranjang);
    }

    useEffect(() => {
        fetchFromKeranjang();
    }, [])

  return (
    <div className='m-24'>
        {items ?
            items.map((data, index) => (
                <div className='mb-4' key={index}>
                    <p>{data.NAMA_PRODUK}</p>
                    <p>{data.HARGA_PRODUK}</p>
                    <p>{data.LOYANG}</p>
                </div>
            ))
            :
            <div>
                EMPTY
            </div>
    }
    </div>
  )
}

export default Keranjang