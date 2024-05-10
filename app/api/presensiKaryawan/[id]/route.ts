import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { status_presensi } = JSON.parse(
      res.body
    );
    
    const [rows, fields] = await connection.execute(
      `UPDATE PRESENSI_KARYAWAN SET STATUS_PRESENSI = '${status_presensi}' WHERE ID_PRESENSI_KARYAWAN = ${params.id}`
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