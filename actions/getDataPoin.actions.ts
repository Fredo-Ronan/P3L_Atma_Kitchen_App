'use server';
import { POIN_DATA } from "@/constants";
import { cookies } from "next/headers";

export async function getDataPoin() {
    const dataPoin = cookies().get(POIN_DATA)?.value;

    if(dataPoin){
        return dataPoin;
    }

    return null;
}