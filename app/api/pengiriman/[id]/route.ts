import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { jarak} = JSON.parse(res.body);

    const ongkir =
      jarak <= 5 ? 10000 :
      jarak <= 10 ? 15000 :
      jarak <= 15 ? 20000 : 25000;

    const [rows] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN
      SET JARAK = ?, 
          ONGKIR = ?, 
          STATUS_TRANSAKSI = 'checkout, belum bayar', 
          TOTAL_HARUS_DIBAYAR = TOTAL_HARUS_DIBAYAR + ?
      WHERE ID_TRANSAKSI_PESANAN = ?`,
      [jarak, ongkir, ongkir, params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Menambahkan Jarak dan Ongkir",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
