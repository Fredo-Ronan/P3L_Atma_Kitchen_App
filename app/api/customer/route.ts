import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

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

    let query = "SELECT * FROM CUSTOMER";

    if (q) {
      query += ` WHERE NAMA_CUSTOMER LIKE '%${q}%'`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    let totalData = 0;

    const [count] = await connection.execute(query);

    if (Array.isArray(count)) {
      if (count.length === 0) {
        connection.end();
        return NextResponse.json({ data: [], totalData: 0 });
      }
      totalData = count.length;
    }

    const offset = (Number(page) - 1) * 10;

    query += ` LIMIT 10 OFFSET ${offset}`;

    const [rows] = await connection.execute(query);

    connection.end();

    return NextResponse.json({ data: rows, totalData }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
