'use server';

import { KERANJANG } from "@/constants";
import { PRODUK_FOR_KERANJANG } from "@/types";
import { cookies } from "next/headers";


export async function updateKeranjang(produk: PRODUK_FOR_KERANJANG[]){
    // delete cookies of keranjang first
    await deleteKeranjang();

    const stringifyProduk = JSON.stringify(produk);
    cookies().set(KERANJANG, stringifyProduk);
}

export async function deleteKeranjang(){
    cookies().delete(KERANJANG);
}