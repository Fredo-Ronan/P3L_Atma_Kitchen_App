import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();

        const queryGetAllBahan = `SELECT * FROM BAHAN`;

        const [resultGetAllBahan, fields] = await connection.execute(queryGetAllBahan);
        connection.end();

        return NextResponse.json({
            dataBahan: resultGetAllBahan
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}