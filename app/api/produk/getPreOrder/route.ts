import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const connection = await connect();

        const queryGetPreorder = `SELECT * FROM PRODUK WHERE JENIS_PRODUK LIKE 'Pre Order'`;

        const [resultQueryPreorder, fields] = await connection.execute(queryGetPreorder);
        connection.end();

        return NextResponse.json({
            dataProdukPreorder: resultQueryPreorder
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}