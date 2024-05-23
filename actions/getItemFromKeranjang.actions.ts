'use server';
import { KERANJANG } from "@/constants";
import { PRODUK, PRODUK_FOR_KERANJANG } from "@/types";
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