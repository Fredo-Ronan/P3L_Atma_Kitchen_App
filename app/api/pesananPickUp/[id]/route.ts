import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    
    const [rows, fields] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_PESANAN = 'pesanan siap diambil' WHERE ID_TRANSAKSI_PESANAN = ${params.id}`
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