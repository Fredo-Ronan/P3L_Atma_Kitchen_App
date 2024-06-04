import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id_transaksi_pesanan: string } }){
    try {
        const connection = await connect();

        const queryGetDetilTransaksi = `SELECT * FROM DETIL_TRANSAKSI DT JOIN PRODUK P ON DT.ID_PRODUK=P.ID_PRODUK WHERE DT.ID_TRANSAKSI_PESANAN = ?`;

        const [result, fields] = await connection.execute(queryGetDetilTransaksi, [params.id_transaksi_pesanan]);
        connection.end();

        return NextResponse.json({
            dataDetilTransaksi: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}