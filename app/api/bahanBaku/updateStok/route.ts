import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();
        const { nama_bahan, stok_digunakan } = JSON.parse(request.body);

        // console.log(nama_bahan);
        // console.log(stok_digunakan);

        const updateStokBahan = `UPDATE BAHAN SET STOK_BAHAN = STOK_BAHAN - ? WHERE NAMA_BAHAN LIKE ?`;

        const [result, fileds] = await connection.execute(updateStokBahan, [stok_digunakan, nama_bahan]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}