import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { total_bayar_customer } = JSON.parse(res.body);

    await connection.execute(
      `UPDATE TRANSAKSI_PESANAN
         SET TOTAL_BAYAR_CUSTOMER = ?,
         STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi'
         WHERE ID_TRANSAKSI_PESANAN = ?`,
      [total_bayar_customer, params.id]
    );

    const [result] = await connection.execute(
      `INSERT INTO TIP (ID_TRANSAKSI_PESANAN, JUMLAH_TIP)
         SELECT ?, GREATEST(? - TOTAL_HARUS_DIBAYAR, 0)
         FROM TRANSAKSI_PESANAN
         WHERE ID_TRANSAKSI_PESANAN = ?`,
      [params.id, total_bayar_customer, params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message:
        "Berhasil memperbarui total bayar customer dan menambahkan tip jika ada sisa",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Terjadi kesalahan pada server",
    });
  }
}
