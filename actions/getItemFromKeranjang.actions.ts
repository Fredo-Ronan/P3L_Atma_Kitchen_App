'use server';
import { KERANJANG, KERANJANG_HAMPERS } from "@/constants";
import { HAMPERS,HAMPERS_FOR_KERANJANG,PRODUK_FOR_KERANJANG } from "@/types";
import { cookies } from "next/headers";

export async function getItemsFromKeranjang(): Promise<PRODUK_FOR_KERANJANG[]> {
    const keranjang = cookies().get(KERANJANG);

    if(keranjang){
        const items = JSON.parse(keranjang.value);
    
        // console.log(items);
        return items;
    }

    return [];
}

export async function getItemsHampersFromKeranjang(): Promise<HAMPERS_FOR_KERANJANG[]> {
    const keranjangHampers = cookies().get(KERANJANG_HAMPERS);

    if(keranjangHampers){
        const items = JSON.parse(keranjangHampers.value);
        return items;
    }

    return [];
}