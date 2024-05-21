import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();

        const queryGetReadyStock = `SELECT * FROM PRODUK WHERE (JENIS_PRODUK = 'Titipan' AND STOK > 0) OR STOK > 0`;

        const [resultGetReadyStock, fields] = await connection.execute(queryGetReadyStock);
        connection.end();

        return NextResponse.json({
            produkReadyStock: resultGetReadyStock
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}