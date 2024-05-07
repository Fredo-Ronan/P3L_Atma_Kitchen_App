import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id_hampers: string} }){
    try {
        const connection = await connect();

        const queryDeleteDetilHampers = `DELETE FROM RELASI_PRODUK_HAMPERS WHERE ID_HAMPERS = ?`;

        const [resultDeleteDetilHampers, fields] = await connection.execute(queryDeleteDetilHampers, [params.id_hampers]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}