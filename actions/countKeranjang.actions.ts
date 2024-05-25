'use server';
import { KERANJANG, KERANJANG_HAMPERS } from "@/constants";
import { cookies } from "next/headers";

// fungsi untuk menghitung jumlah barang di keranjang kalau ada
export async function countItemKeranjang() {
    const keranjang = cookies().get(KERANJANG);
    let count = 0;

    if(keranjang){
        // console.log(keranjang.value);
        // console.log(JSON.parse(keranjang.value).length);
        count += JSON.parse(keranjang.value).length;
        const keranjangHampers = cookies().get(KERANJANG_HAMPERS);

        if(keranjangHampers){
            count += JSON.parse(keranjangHampers.value).length; 
        }

        return count;
    }

    const keranjangHampers = cookies().get(KERANJANG_HAMPERS);

    if(keranjangHampers){
        count += JSON.parse(keranjangHampers.value).length; 
        return count;
    }

    return 0;
}