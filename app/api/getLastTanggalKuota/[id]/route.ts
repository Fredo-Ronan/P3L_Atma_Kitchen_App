import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryLastTanggal = `SELECT LAST_TANGGAL FROM TANGGAL_LAST_KUOTA`;

        const [result, fields] = await connection.execute(queryLastTanggal);
        connection.end();

        return NextResponse.json({
            lastTanggal: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}