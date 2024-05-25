import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();

        const {id_customer, poinUpdate} = JSON.parse(request.body);

        const queryUpdatePoinCustomer = `UPDATE CUSTOMER SET TOTAL_POIN = ? WHERE ID_CUSTOMER = ?`;

        const [resultUpdatePoinCustomer, fields] = await connection.execute(queryUpdatePoinCustomer, [poinUpdate, id_customer]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}