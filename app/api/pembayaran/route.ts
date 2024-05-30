import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db";

export async function GET(request: NextRequest) {
    try {
      const connection = await connect();
      let page = request.nextUrl.searchParams.get("page") || 1;
  
  
      if (Number(page) <= 0 || isNaN(Number(page))) {
        connection.end();
        return NextResponse.json({ data: [], totalData: 0 });
      }
  
      let query = `SELECT TP.ID_TRANSAKSI_PESANAN, C.NAMA_CUSTOMER, 
      TP.STATUS_TRANSAKSI, TP.TOTAL_BAYAR_CUSTOMER, T.JUMLAH_TIP, TP.BUKTI_TF
      FROM TRANSAKSI_PESANAN TP 
      JOIN CUSTOMER C ON TP.ID_CUSTOMER = C.ID_CUSTOMER 
      LEFT JOIN TIP T ON T.ID_TRANSAKSI_PESANAN = TP.ID_TRANSAKSI_PESANAN 
      WHERE TP.STATUS_TRANSAKSI = 'checkout, menunggu konfirmasi pembayaran' 
      OR TP.STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi'
      ORDER BY 
      CASE 
          WHEN TP.STATUS_TRANSAKSI = 'checkout, menunggu konfirmasi pembayaran' THEN 1 
          ELSE 2 
      END`;
  
      const offset = (Number(page) - 1) * 10;
  
      let totalData = 0;
  
      let [rows, fields] = await connection.execute(query);
  
      if (Array.isArray(rows)) {
        totalData = rows.length;
      }
  
      if (totalData === 0) {
        connection.end();
        return NextResponse.json({ data: [], totalData });
      }
  
      query += ` LIMIT 10 OFFSET ${offset}`;
  
      [rows, fields] = await connection.execute(query);
  
      connection.end();
  
      return NextResponse.json(
        { data: rows, totalData },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }