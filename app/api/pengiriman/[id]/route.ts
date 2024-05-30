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

    const [rows] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN
      SET JARAK = ?, 
          ONGKIR = CASE 
                      WHEN ? <= 5 THEN 10000
                      WHEN ? <= 10 THEN 15000
                      WHEN ? <= 15 THEN 20000
                      ELSE 25000
                   END,
          STATUS_TRANSAKSI = 'checkout, belum bayar', 
          TOTAL_HARUS_DIBAYAR = TOTAL_HARUS_DIBAYAR + CASE 
                                                       WHEN ? <= 5 THEN 10000
                                                       WHEN ? <= 10 THEN 15000
                                                       WHEN ? <= 15 THEN 20000
                                                       ELSE 25000
                                                     END
      WHERE ID_TRANSAKSI_PESANAN = ?`,
      [jarak, params.id]
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
