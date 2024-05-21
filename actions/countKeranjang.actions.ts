'use server';
import { KERANJANG } from "@/constants";
import { cookies } from "next/headers";

// fungsi untuk menghitung jumlah barang di keranjang kalau ada
export async function countItemKeranjang() {
    const keranjang = cookies().get(KERANJANG);

    if(keranjang){
        return 1;
    }

    return 0;
}