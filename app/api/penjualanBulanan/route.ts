import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db";

export async function GET(request: NextRequest) {
  try {
    const connection = await connect();

    let query = `SELECT 
    MONTH(TANGGAL_PESANAN) AS BULAN,
    SUM(TOTAL_HARUS_DIBAYAR) AS TOTAL_HARGA,
    COUNT(ID_TRANSAKSI_PESANAN) AS TOTAL_TRANSAKSI,
        (SELECT SUM(TOTAL_HARUS_DIBAYAR) 
        FROM TRANSAKSI_PESANAN 
        WHERE TANGGAL_PESANAN >= '2024-01-01' AND 
              TANGGAL_PESANAN < '2025-01-01' AND
              (STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi')) AS TOTAL_HARGA_TAHUNAN
    FROM 
        TRANSAKSI_PESANAN
    WHERE 
        TANGGAL_PESANAN >= '2024-01-01' AND 
        TANGGAL_PESANAN < '2025-01-01' AND
        (STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi')
    GROUP BY 
        MONTH(TANGGAL_PESANAN)
    ORDER BY 
        BULAN`;

    let [rows] = await connection.execute(query);

    connection.end();

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
