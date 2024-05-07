import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();
        const request = await req.json();

        const { id_hampers, id_produk } = JSON.parse(request.body);

        const queryInsertDetilHampers = `INSERT INTO RELASI_PRODUK_HAMPERS (ID_HAMPERS, ID_PRODUK) VALUES (?,?)`;

        const [resultInsertDetilHampers, fields] = await connection.execute(queryInsertDetilHampers, [id_hampers, id_produk]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}