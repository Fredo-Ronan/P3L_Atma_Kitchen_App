import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id_customer: string } }){
    try {
        const connection = await connect();

        const queryGetPoin = `SELECT TOTAL_POIN FROM CUSTOMER WHERE ID_CUSTOMER = ?`;

        const [result, fields] = await connection.execute(queryGetPoin, [params.id_customer]);
        connection.end();

        return NextResponse.json({
            poin: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}