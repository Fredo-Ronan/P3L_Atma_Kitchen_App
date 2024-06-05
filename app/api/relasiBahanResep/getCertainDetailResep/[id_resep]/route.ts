import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id_resep: string } }){
    try {
        const connection = await connect();

        const queryGetCertainDetailResep = `SELECT RB.ID_RELASI_BAHAN_RESEP, B.ID_BAHAN, B.NAMA_BAHAN, RB.JUMLAH_DIBUTUHKAN, RB.SATUAN
        FROM RELASI_BAHAN_RESEP AS RB
        JOIN BAHAN AS B ON RB.id_bahan = B.id_bahan
        JOIN RESEP AS R ON RB.id_resep = R.id_resep
        WHERE R.ID_RESEP = ${params.id_resep}`;

        const [result, fields] = await connection.execute(queryGetCertainDetailResep);
        connection.end();

        return NextResponse.json({
            dataBahanDibutuhkan: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}