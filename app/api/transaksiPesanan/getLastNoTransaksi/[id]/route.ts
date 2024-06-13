import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryGetLastNoTransaksi = `SELECT NO_TRANSAKSI FROM TRANSAKSI_PESANAN ORDER BY ID_TRANSAKSI_PESANAN DESC LIMIT 1`;

        const [result, fields] = await connection.execute(queryGetLastNoTransaksi);
        connection.end();

        if(parseResultQuery(result) === ""){
            return NextResponse.json({
                lastNoTransaksi: 0
            }, { status: 200 });
        }

        return NextResponse.json({
            lastNoTransaksi: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}