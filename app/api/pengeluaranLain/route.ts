import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const connection = await connect();
    const res = await request.json();

    const { nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran } =
      JSON.parse(res.body);

    const [rows] = await connection.execute(
      `INSERT INTO PENGELUARAN_LAIN
        (NAMA_PENGELUARAN, BIAYA_PENGELUARAN, TANGGAL_PENGELUARAN) VALUES (?,?,?)`,
      [nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran]
    );

    connection.end();
    return NextResponse.json({
      status: 201,
      message: "Berhasil menambah pengeluaran lain",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const connection = await connect();

    const orderBy = request.nextUrl.searchParams.get("orderBy") || "";
    const page = request.nextUrl.searchParams.get("page") || 1;
    const q = request.nextUrl.searchParams.get("q") || "";

    if (Number(page) <= 0 || isNaN(Number(page))) {
      connection.end();
      return NextResponse.json({ data: [], totalData: 0 });
    }

    let query = "SELECT * FROM PENGELUARAN_LAIN";

    if (q) {
      query += ` WHERE NAMA_PENGELUARAN LIKE '%${q}%'`;
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
