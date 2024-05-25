import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();

        const {id_customer, tanggal_pesanan, alamat_pengiriman, status_pesanan, tipe_pengiriman, total_item, status_transaksi, tanggal_pengiriman, total_harga, total_harus_dibayar} = JSON.parse(request.body);

        const queryInsertTransaksiPesanan = `INSERT INTO TRANSAKSI_PESANAN (ID_CUSTOMER, TANGGAL_PESANAN, ALAMAT_PENGIRIMAN, STATUS_PESANAN, TIPE_PENGIRIMAN, TOTAL_ITEM, STATUS_TRANSAKSI, TANGGAL_PENGIRIMAN, TOTAL_HARGA, TOTAL_HARUS_DIBAYAR) VALUES (?,?,?,?,?,?,?,?,?,?)`;

        const [resultInsertTransaksiPesanan, fields] = await connection.execute(queryInsertTransaksiPesanan, [id_customer, tanggal_pesanan, alamat_pengiriman, status_pesanan, tipe_pengiriman, total_item, status_transaksi, tanggal_pengiriman, total_harga, total_harus_dibayar]);
        connection.end();

        const resultFinal = parseResultQuery(resultInsertTransaksiPesanan);

        return NextResponse.json({
            insertId: JSON.parse(resultFinal).insertId
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}