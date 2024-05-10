import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const { status_presensi } = await req.json();

    const [rows, fields] = await connection.execute(
      `UPDATE PRESENSI_KARYAWAN SET STATUS_PRESENSI = '${status_presensi}' WHERE ID_PRESENSI_KARYAWAN = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Mengubah Presensi Karyawan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
