import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();

    const res = await request.json();
    const { nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran } =
      JSON.parse(res.body);

    const [isExist] = await connection.execute(
      `SELECT * FROM PENGELUARAN_LAIN WHERE ID_PENGELUARAN_LAIN = ?`,
      [params.id]
    );

    if (Array.isArray(isExist)) {
      if (isExist.length === 0) {
        connection.end();
        return NextResponse.json({
          status: 404,
          message: "Pengeluaran lain tidak ditemukan",
        });
      }
    }

    const [rows] = await connection.execute(
      `UPDATE PENGELUARAN_LAIN SET NAMA_PENGELUARAN = ?, BIAYA_PENGELUARAN = ?, TANGGAL_PENGELUARAN = ? WHERE ID_PENGELUARAN_LAIN = ?`,
      [nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran, params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengubah pengeluaran lain",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();

    const [isExist] = await connection.execute(
      `SELECT * FROM PENGELUARAN_LAIN WHERE ID_PENGELUARAN_LAIN = ?`,
      [params.id]
    );

    if (Array.isArray(isExist)) {
      if (isExist.length === 0) {
        connection.end();
        return NextResponse.json({
          status: 404,
          message: "Pengeluaran lain tidak ditemukan",
        });
      }
    }

    const [rows] = await connection.execute(
      `DELETE FROM PENGELUARAN_LAIN WHERE ID_PENGELUARAN_LAIN = ?`,
      [params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus pengeluaran lain",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
