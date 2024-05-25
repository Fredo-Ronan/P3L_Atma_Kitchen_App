import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();

        const { id_transaksi_pesanan, id_produk, jumlah_pesanan, sub_total, id_hampers, id_customer } = JSON.parse(request.body);

        const queryInsertDetilTransaksi = `INSERT INTO DETIL_TRANSAKSI (ID_TRANSAKSI_PESANAN, ID_PRODUK, JUMLAH_PESANAN, SUBTOTAL, ID_HAMPERS, ID_CUSTOMER) VALUES (?,?,?,?,?,?)`;

        const [resultInsert, fields] = await connection.execute(queryInsertDetilTransaksi, [id_transaksi_pesanan, id_produk, jumlah_pesanan, sub_total, id_hampers, id_customer]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}