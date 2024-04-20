import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const connection = await connect();
    const res = await req.json();

    const { nama_bahan, harga_bahan, stok_bahan, satuan } = JSON.parse(
      res.body
    );

    const [rows, fields] = await connection.execute(
      `INSERT INTO BAHAN (NAMA_BAHAN, HARGA_BAHAN, STOK_BAHAN, SATUAN) VALUES ('${nama_bahan}', ${harga_bahan}, ${stok_bahan}, '${satuan}')`
    );

    connection.end();
    return NextResponse.json(rows, {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const connection = await connect();

    const q = request.nextUrl.searchParams.get("q");
    const orderBy = request.nextUrl.searchParams.get("orderBy");
    const page = request.nextUrl.searchParams.get("page") || 1;
    const filter = request.nextUrl.searchParams.get("filter");

    console.log(q, orderBy, page);

    let query = `SELECT * FROM BAHAN`;

    if (q) {
      query += ` WHERE NAMA_BAHAN LIKE '%${q}%'`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    if (filter) {
      if (q) {
        query += ` AND SATUAN = '${filter}'`;
      } else {
        query += ` WHERE SATUAN = '${filter}'`;
      }
    }

    const offset = (Number(page) - 1) * 10;

    let totalData = 0;

    let [rows, fields] = await connection.execute(query);

    if(Array.isArray(rows)) {
      totalData = rows.length;
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    console.log(query);

    [rows, fields] = await connection.execute(query);

    connection.end();

    return NextResponse.json({ data: rows, totalData }, {
      status: 200,
    });
  } catch (error) {}
}
