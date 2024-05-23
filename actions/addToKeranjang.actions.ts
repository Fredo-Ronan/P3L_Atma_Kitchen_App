'use server';
import { KERANJANG } from "@/constants";
import { PRODUK_FOR_KERANJANG } from "@/types";
import { cookies } from "next/headers";

export async function addToKeranjang(produk: PRODUK_FOR_KERANJANG[]){
    const keranjangValue = cookies().get(KERANJANG);

    if(!keranjangValue){
        const stringifyProduk = JSON.stringify(produk);
    
        // console.log(stringifyProduk);
        // console.log(JSON.parse(stringifyProduk));
        cookies().set(KERANJANG, stringifyProduk);
        return;
    }

    let oldKeranjang = JSON.parse(keranjangValue.value);
    
    produk.forEach((data) => {
        oldKeranjang.push(data);
    })

    const stringifyNewProduk = JSON.stringify(oldKeranjang);
    cookies().set(KERANJANG, stringifyNewProduk);
}