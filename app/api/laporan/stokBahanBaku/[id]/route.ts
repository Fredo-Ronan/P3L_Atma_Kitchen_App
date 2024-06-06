import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryGetStokBahan = `SELECT NAMA_BAHAN, SATUAN, STOK_BAHAN FROM BAHAN`;

        const [result, fields] = await connection.execute(queryGetStokBahan);
        connection.end();

        return NextResponse.json({
            data: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}