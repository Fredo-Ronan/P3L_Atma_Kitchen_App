import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { id_role, nama_karyawan, email_karyawan, alamat_karyawan, no_telp_karyawan } = JSON.parse(
      res.body
    );
    
    const [rows, fields] = await connection.execute(
      `UPDATE KARYAWAN SET ID_ROLE = ${id_role}, NAMA_KARYAWAN = '${nama_karyawan}', EMAIL_KARYAWAN = '${email_karyawan}', 
      ALAMAT_KARYAWAN = '${alamat_karyawan}', NO_TELP_KARYAWAN = '${no_telp_karyawan}' WHERE ID_KARYAWAN = ${params.id}`
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();

    const [rows, fields] = await connection.execute(
      "DELETE FROM KARYAWAN WHERE ID_KARYAWAN = ?",
      [params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Menghapus Karyawan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

