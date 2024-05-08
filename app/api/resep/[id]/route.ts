import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { nama_resep} = JSON.parse(
      res.body
    );

    const [rows, fields] = await connection.execute(
      `UPDATE RESEP SET NAMA_RESEP = '${nama_resep}' WHERE ID_RESEP = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengubah resep",
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
      "DELETE FROM RESEP WHERE ID_RESEP = ?",
      [params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus resep",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

