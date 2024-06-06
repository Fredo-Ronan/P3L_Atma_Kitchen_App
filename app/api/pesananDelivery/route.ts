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
  
      let query = `SELECT * FROM TRANSAKSI_PESANAN TP 
      JOIN CUSTOMER C ON TP.ID_CUSTOMER = C.ID_CUSTOMER 
      WHERE (TP.STATUS_PESANAN = 'pesanan diproses'
             OR TP.STATUS_PESANAN = 'pesanan siap dikirim'
             OR TP.STATUS_PESANAN = 'dibawa kurir')
        AND TP.TIPE_PENGIRIMAN = 'delivery'`;
  
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