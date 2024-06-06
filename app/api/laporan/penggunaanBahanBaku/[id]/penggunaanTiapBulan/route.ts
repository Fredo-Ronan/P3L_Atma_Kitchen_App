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

    let [rows]: any = await connection.execute(query); // Here we type rows as any

    connection.end();

    // Array bulan dari Januari hingga Desember
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Buat array yang akan menampung hasil dengan data bulan yang lengkap
    const completeData = months.map((month, index) => {
      const bulanData = rows.find((row: any) => row.BULAN === index + 1); // Here we type row as any
      return bulanData ? { ...bulanData, BULAN: month } : { BULAN: month, TOTAL_HARGA: 0, TOTAL_TRANSAKSI: 0, TOTAL_HARGA_TAHUNAN: rows[0]?.TOTAL_HARGA_TAHUNAN || 0 };
    });

    return NextResponse.json({ data: completeData }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
