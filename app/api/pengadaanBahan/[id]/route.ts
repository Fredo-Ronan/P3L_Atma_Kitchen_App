import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryDeletePengadaanBahan = `DELETE FROM PENGADAAN_BAHAN WHERE ID_PENGADAAN_BAHAN = ?`;

        const [resultDeletePengadaan, fields] = await connection.execute(queryDeletePengadaanBahan, [params.id]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const request = await req.json();

        const { id_bahan, nama_bahan, harga_beli_bahan, tanggal_beli, jumlah_beli } = JSON.parse(request.body);

        const queryUpdatePengadaanBahan = `UPDATE PENGADAAN_BAHAN SET ID_BAHAN = ?, NAMA_BAHAN = ?, HARGA_BELI_BAHAN = ?, TANGGAL_BELI = ?, JUMLAH_BELI = ? WHERE ID_PENGADAAN_BAHAN = ?`;

        const [resultUpdate, fields] = await connection.execute(queryUpdatePengadaanBahan, [id_bahan, nama_bahan, harga_beli_bahan, tanggal_beli, jumlah_beli, params.id]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}