import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    
    const [rows, fields] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_PESANAN = 'dibawa kurir' WHERE ID_TRANSAKSI_PESANAN = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Mengubah Karyawan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}