import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();

    const orderBy = request.nextUrl.searchParams.get("orderBy") || "";
    const page = request.nextUrl.searchParams.get("page") || 1;
    const filter = request.nextUrl.searchParams.get("filter") || "";

    let user;

    const [dataUser] = await connection.execute(
      `SELECT NAMA_CUSTOMER FROM CUSTOMER WHERE ID_CUSTOMER = ?`,
      [params.id]
    );

    if (Array.isArray(dataUser)) {
      if (dataUser.length === 0) {
        connection.end();
        return NextResponse.json({
          data: [],
          totalData: 0,
          user: { NAMA_CUSTOMER: "404" },
        });
      }
      user = dataUser[0];
    }

    if (Number(page) <= 0 || isNaN(Number(page))) {
      connection.end();
      return NextResponse.json({
        data: [],
        totalData: 0,
        user,
      });
    }

    let query = `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_CUSTOMER = ${params.id}`;

    if (filter) {
      query += ` AND STATUS_TRANSAKSI = '${filter}'`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    let totalData = 0;
    const offset = (Number(page) - 1) * 10;

    const [count] = await connection.execute(query);

    if (Array.isArray(count)) {
      if (count.length === 0) {
        connection.end();
        return NextResponse.json({
          data: [],
          totalData: 0,
          user,
        });
      }
      totalData = count.length;
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    const [rows] = await connection.execute(query);

    connection.end();

    return NextResponse.json({ data: rows, totalData, user }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
