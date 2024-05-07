import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();

        const getAllProdukQuery = `SELECT * FROM PRODUK`;

        const [resultProduk, fields] = await connection.execute(getAllProdukQuery);
        connection.end();

        return NextResponse.json({
            allDataProduk: resultProduk
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}