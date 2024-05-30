import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryGetAllColumnProduk = `SELECT * FROM PRODUK WHERE ID_PRODUK = ?`;

        const [result, fields] = await connection.execute(queryGetAllColumnProduk, [params.id]);
        connection.end();

        return NextResponse.json({
            dataProduk: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}