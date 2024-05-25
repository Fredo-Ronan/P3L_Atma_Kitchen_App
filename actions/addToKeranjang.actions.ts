'use server';
import { KERANJANG, KERANJANG_HAMPERS } from "@/constants";
import { HAMPERS_FOR_KERANJANG, PRODUK_FOR_KERANJANG } from "@/types";
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

export async function addToHampersKeranjang(hampers: HAMPERS_FOR_KERANJANG[]){
    const keranjangHampersValue = cookies().get(KERANJANG_HAMPERS);

    if(!keranjangHampersValue){
        const stringifyHampers = JSON.stringify(hampers);

        cookies().set(KERANJANG_HAMPERS, stringifyHampers);
        return;
    }

    let oldKeranjangHampers = JSON.parse(keranjangHampersValue.value);

    hampers.forEach((data) => {
        oldKeranjangHampers.push(data);
    })

    const stringifyNewHampers = JSON.stringify(oldKeranjangHampers);
    cookies().set(KERANJANG_HAMPERS, stringifyNewHampers);
}