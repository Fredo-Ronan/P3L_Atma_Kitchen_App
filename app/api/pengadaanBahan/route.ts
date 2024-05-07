import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();

        const { id_bahan, nama_bahan, harga_beli_bahan, tanggal_beli, jumlah_beli } = JSON.parse(request.body);

        const queryInsertPengadaanBahan = `INSERT INTO PENGADAAN_BAHAN (ID_BAHAN, NAMA_BAHAN, HARGA_BELI_BAHAN, TANGGAL_BELI, JUMLAH_BELI) VALUES (?,?,?,?,?)`;

        const [resultInsertPengadaanBahan, fields] = await connection.execute(queryInsertPengadaanBahan, [id_bahan, nama_bahan, harga_beli_bahan, tanggal_beli, jumlah_beli]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function GET(req: NextRequest){
    try {
        const connection = await connect();
    
        const orderBy = req.nextUrl.searchParams.get("orderBy") || "";
        const page = req.nextUrl.searchParams.get("page") || 1;
        const q = req.nextUrl.searchParams.get("q") || "";
    
        if (Number(page) <= 0 || isNaN(Number(page))) {
          connection.end();
          return NextResponse.json({ data: [], totalData: 0 });
        }
    
        let query = "SELECT * FROM PENGADAAN_BAHAN";
    
        if (q) {
          query += ` WHERE NAMA_BAHAN LIKE '%${q}%'`;
        }
    
        if (orderBy) {
          query += ` ORDER BY ${orderBy}`;
        }
    
        let totalData = 0;
    
        const offset = (Number(page) - 1) * 10;
    
        const [rows] = await connection.execute(query);
    
        if (Array.isArray(rows)) {
          if (rows.length === 0) {
            connection.end();
            return NextResponse.json({ data: [], totalData: 0 });
          }
          totalData = rows.length;
        }
    
        query += ` LIMIT 10 OFFSET ${offset}`;
    
        const [data] = await connection.execute(query);
    
        connection.end();
    
        return NextResponse.json({ data, totalData }, { status: 200 });
      } catch (error) {
        console.log(error);
        throw error;
      }
}