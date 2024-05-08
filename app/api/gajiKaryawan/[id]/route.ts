import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { nominal_gaji} = JSON.parse(
      res.body
    );
    
    const [rows, fields] = await connection.execute(
      `UPDATE ROLE SET NOMINAL_GAJI = ${nominal_gaji} WHERE ID_ROLE = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Mengubah Gaji Karyawan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}