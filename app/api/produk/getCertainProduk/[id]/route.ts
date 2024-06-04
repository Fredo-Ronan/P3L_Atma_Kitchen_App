import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryGetCertainProduk = `SELECT * FROM PRODUK WHERE ID_PRODUK = ?`;

        const [result, fields] = await connection.execute(queryGetCertainProduk, [params.id]);
        connection.end();

        return NextResponse.json({
            dataProduk: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}