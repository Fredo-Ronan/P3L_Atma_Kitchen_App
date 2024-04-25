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
    const q = request.nextUrl.searchParams.get("q") || "";

    if (Number(page) <= 0 || isNaN(Number(page))) {
      connection.end();
      return NextResponse.json({
        data: [],
        totalData: 0,
      });
    }

    console.log(params.id);
    console.log("hallo");
    let query = `SELECT PRODUK.NAMA_PRODUK, DETIL_TRANSAKSI.*, HAMPERS.NAMA_HAMPERS FROM DETIL_TRANSAKSI JOIN PRODUK ON DETIL_TRANSAKSI.ID_PRODUK = PRODUK.ID_PRODUK LEFT JOIN HAMPERS ON DETIL_TRANSAKSI.ID_HAMPERS = HAMPERS.ID_HAMPERS WHERE ID_TRANSAKSI_PESANAN = ${params.id}`;

   

    if (q) {
      query += ` AND PRODUK.NAMA_PRODUK LIKE '%${q}%'`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    let totalData = 0;
    const offset = (Number(page) - 1) * 10;

    const [count] = await connection.execute(query);
    console.log(query);
    console.log(count);
    if (Array.isArray(count)) {
      if (count.length === 0) {
        connection.end();
        return NextResponse.json({ data: [], totalData: 0 });
      }
      totalData = count.length;
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    const [rows] = await connection.execute(query);

    connection.end();

    return NextResponse.json({ data: rows, totalData }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
