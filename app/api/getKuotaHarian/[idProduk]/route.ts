import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { idProduk: string } }){
    try {
        const connection = await connect();

        const queryKuotaHarian = `SELECT * FROM KUOTA_HARIAN WHERE ID_PRODUK = ${params.idProduk}`;

        const [resultKuotaHarian, fields] = await connection.execute(queryKuotaHarian);
        connection.end();

        return NextResponse.json({
            data: resultKuotaHarian
        },{ status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function PUT(req: NextRequest, { params }: { params: { idProduk: string } }){
    try {
        const connection = await connect();
        const request = await req.json();

        const { kuota, keterangan, tanggal } = JSON.parse(request.body);
        console.log(`FROM API ${tanggal}`);

        const queryUpdateKuotaHarian = `UPDATE KUOTA_HARIAN SET KUOTA = ?, KETERANGAN = ? WHERE ID_PRODUK = ? AND TANGGAL_KUOTA = ?`;

        const [resultUpdate, fields] = await connection.execute(queryUpdateKuotaHarian, [kuota, keterangan, params.idProduk, tanggal]);
        connection.end();

        return NextResponse.json({
            status: StatusCodesP3L.OK
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}