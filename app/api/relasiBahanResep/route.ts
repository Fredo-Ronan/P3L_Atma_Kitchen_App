import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const connection = await connect();
      const res = await req.json();
  
      const { id_bahan, id_resep, jumlah_dibutuhkan, satuan} = JSON.parse(
        res.body
      );
  
      const [rows, fields] = await connection.execute(
        `INSERT INTO RELASI_BAHAN_RESEP (ID_BAHAN, ID_RESEP, JUMLAH_DIBUTUHKAN, SATUAN) VALUES (${id_bahan}, ${id_resep}, ${jumlah_dibutuhkan}, '${satuan}')`
      );
  
      connection.end();
      return NextResponse.json(rows, {
        status: 201,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
}