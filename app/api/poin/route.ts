import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();

        const queryGetDataPoin = `SELECT * FROM POIN`;

        const [resultGetDataPoin, fields] = await connection.execute(queryGetDataPoin);
        connection.end();

        return NextResponse.json({
            dataPoin: resultGetDataPoin
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}