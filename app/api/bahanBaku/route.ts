import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db";
import { createBahanBakuSchma } from "@/app/validation";

export async function POST(req: NextRequest) {
  try {
    const connection = await connect();
    const res = await req.json();

    const { nama_bahan, harga_bahan, stok_bahan, satuan } = JSON.parse(
      res.body
    );

    const [rows,fields] = await connection.execute(
      `INSERT INTO BAHAN (NAMA_BAHAN, HARGA_BAHAN, STOK_BAHAN, SATUAN) VALUES ('${nama_bahan}', ${harga_bahan}, ${stok_bahan}, '${satuan}')`
    );

    connection.end();
    return NextResponse.json(rows,{
      status: 201,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET() {
  try {
    const connection = await connect();

    const [rows, fields] = await connection.execute("Select * from BAHAN");

    connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    
  }
}