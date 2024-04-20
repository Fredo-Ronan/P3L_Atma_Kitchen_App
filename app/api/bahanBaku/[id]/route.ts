import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { nama_bahan, harga_bahan, stok_bahan, satuan } = JSON.parse(
      res.body
    );

    const [rows, fields] = await connection.execute(
      `UPDATE BAHAN SET NAMA_BAHAN = '${nama_bahan}', HARGA_BAHAN = ${harga_bahan}, STOK_BAHAN = ${stok_bahan}, SATUAN = '${satuan}' WHERE ID_BAHAN = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengubah bahan baku",
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
      "DELETE FROM BAHAN WHERE ID_BAHAN = ?",
      [params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus bahan baku",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
