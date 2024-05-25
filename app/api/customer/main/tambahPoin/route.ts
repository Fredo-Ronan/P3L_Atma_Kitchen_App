import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();
        const {id_customer, updatePoin} = JSON.parse(request.body);

        const queryUpdatePoin = `UPDATE CUSTOMER SET TOTAL_POIN = ? WHERE ID_CUSTOMER = ?`;

        const [resultUpdatePoin, fields] = await connection.execute(queryUpdatePoin, [updatePoin, id_customer]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}