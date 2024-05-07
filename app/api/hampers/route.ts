import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();

        const queryGetAllHampers = `SELECT * FROM HAMPERS`;

        const [resultGetHampers, fields] = await connection.execute(queryGetAllHampers);
        connection.end();

        return NextResponse.json({
            dataHampers: resultGetHampers
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function POST(req: NextRequest){
    try {
        const connection = await connect();
        
        const request = await req.json();

        const { nama_hampers, harga_hampers, deskripsi_hampers } = JSON.parse(request.body);

        const queryInsertHampers = `INSERT INTO HAMPERS (NAMA_HAMPERS, HARGA_HAMPERS, DESKRIPSI_HAMPERS) VALUES (?,?,?)`;

        const [resultInsertHampers, fields] = await connection.execute(queryInsertHampers, [nama_hampers, harga_hampers, deskripsi_hampers]);
        connection.end();

        return NextResponse.json({
            insertedHampers: resultInsertHampers
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}