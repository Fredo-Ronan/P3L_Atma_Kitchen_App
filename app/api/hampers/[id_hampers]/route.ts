import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id_hampers: string } }){
    try {
        const connection = await connect();

        const queryDeleteHampers = `DELETE FROM HAMPERS WHERE ID_HAMPERS = ?`;

        const [resultDeleteHampers, fields] = await connection.execute(queryDeleteHampers, [params.id_hampers]);
        connection.end();

        return NextResponse.json({
            data: resultDeleteHampers
        }, { status: 200 });

    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function GET(req: NextRequest, { params }: { params: { id_hampers: string } }){
    try {
        const connection = await connect();

        const queryGetDetilHampers = `SELECT P.* FROM RELASI_PRODUK_HAMPERS PH JOIN PRODUK P ON PH.ID_PRODUK=P.ID_PRODUK WHERE ID_HAMPERS = ?`;
        const queryHampers = `SELECT * FROM HAMPERS WHERE ID_HAMPERS = ?`;

        const [resultQueryDetilHampers, fields] = await connection.execute(queryGetDetilHampers, [params.id_hampers]);
        const [resultHampers, fieldsHampers] = await connection.execute(queryHampers, [params.id_hampers]);
        connection.end();

        return NextResponse.json({
            detilHampers: resultQueryDetilHampers,
            hampers: resultHampers
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id_hampers: string } }){
    try {
        const connection = await connect();

        const request = await req.json();

        const { nama_hampers, harga_hampers, deskripsi_hampers } = JSON.parse(request.body);

        const queryEditHampers = `UPDATE HAMPERS SET NAMA_HAMPERS = ?, HARGA_HAMPERS = ?, DESKRIPSI_HAMPERS = ? WHERE ID_HAMPERS = ?`;

        const [resultUpdateHampers, fields] = await connection.execute(queryEditHampers, [nama_hampers, harga_hampers, deskripsi_hampers, params.id_hampers]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}