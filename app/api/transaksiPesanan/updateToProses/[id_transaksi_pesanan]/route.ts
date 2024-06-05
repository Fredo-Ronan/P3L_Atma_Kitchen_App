import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id_transaksi_pesanan: string } }){
    try {
        const connection = await connect();

        const queryUpdateToProses = `UPDATE TRANSAKSI_PESANAN SET STATUS_PESANAN = 'pesanan diproses' WHERE ID_TRANSAKSI_PESANAN = ?`;

        const [result, fields] = await connection.execute(queryUpdateToProses, [params.id_transaksi_pesanan]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}