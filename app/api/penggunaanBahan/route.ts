import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();
        const { id_bahan, jumlah_digunakan, tanggal_digunakan } = JSON.parse(request.body);

        // console.log(id_bahan);

        const queryInsertPenggunaanBahan = `INSERT INTO PENGGUNAAN_BAHAN_BAKU (ID_BAHAN, JUMLAH_DIGUNAKAN, TANGGAL_DIGUNAKAN) VALUES (?,?,?)`;

        const [result, fields] = await connection.execute(queryInsertPenggunaanBahan, [id_bahan, jumlah_digunakan, tanggal_digunakan]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}