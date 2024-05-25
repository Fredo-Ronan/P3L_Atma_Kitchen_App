'use server';

import { KERANJANG, KERANJANG_HAMPERS } from "@/constants";
import { HAMPERS, PRODUK_FOR_KERANJANG } from "@/types";
import { cookies } from "next/headers";


export async function updateKeranjang(produk: PRODUK_FOR_KERANJANG[]){
    // delete cookies of keranjang first
    await deleteKeranjang();

    const stringifyProduk = JSON.stringify(produk);
    cookies().set(KERANJANG, stringifyProduk);
}

export async function updateHampersKeranjang(hampers: HAMPERS[]){
    await deleteHampersKeranjang();

    const stringifyHampers = JSON.stringify(hampers);
    cookies().set(KERANJANG_HAMPERS, stringifyHampers);
}

export async function deleteKeranjang(){
    cookies().delete(KERANJANG);
}

export async function deleteHampersKeranjang(){
    cookies().delete(KERANJANG_HAMPERS);
}