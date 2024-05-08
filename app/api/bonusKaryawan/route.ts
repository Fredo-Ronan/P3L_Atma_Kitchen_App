import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
      const connection = await connect();
      const res = await request.json();
  
      const { id_karyawan, tanggal_pemberian, bonus} =
        JSON.parse(res.body);
  
      const [rows] = await connection.execute(
        `INSERT INTO BONUS (ID_KARYAWAN, TANGGAL_PEMBERIAN, BONUS ) VALUES (?,?,?)`,
        [ id_karyawan, tanggal_pemberian, bonus]
      );
  
      return NextResponse.json({
        status: 201,
        message: "Berhasil Menambah Bonus Karyawan",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

export async function GET(request: NextRequest) {
  try {
    const connection = await connect();

    // const q = request.nextUrl.searchParams.get("q") || "";
    // const orderBy = request.nextUrl.searchParams.get("orderBy") || "";
    const page = request.nextUrl.searchParams.get("page") || 1;

    if (Number(page) <= 0 || isNaN(Number(page))) {
      connection.end();
      return NextResponse.json({ data: [], totalData: 0 });
    }

    let query = "SELECT * FROM BONUS AS B JOIN KARYAWAN AS K ON B.ID_KARYAWAN = K.ID_KARYAWAN";

    // if (q) {
    //   query += ` WHERE NAMA_KARYAWAN LIKE '%${q}%'`;
    // }

    // if (orderBy) {
    //   query += ` ORDER BY ${orderBy}`;
    // }

    const offset = (Number(page) - 1) * 10;

    let total = 0;

    let [rows, fields] = await connection.execute(query);

    if (Array.isArray(rows)) {
      total = rows.length;
    }

    if (total === 0) {
      connection.end();
      return NextResponse.json({ data: [], totalData: 0 });
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    [rows, fields] = await connection.execute(query);

    connection.end();
    return NextResponse.json({ data: rows, totalData: total }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
