import { connect } from "@/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const connection = await connect();
    const res = await request.json();

    const { nama_penitip, email_penitip, no_telp_penitip, alamat_penitip } =
      JSON.parse(res.body);

    const [existingRows] = await connection.execute(
      `SELECT * FROM PENITIP_PRODUK WHERE EMAIL_PENITIP = ?`,
      [email_penitip]
    );

    if (Array.isArray(existingRows)) {
      if (existingRows.length > 0) {
        return NextResponse.json({
          status: 400,
          message: "Email telah digunakan oleh penitip lain.",
        });
      }
    }

   

    const [rows] = await connection.execute(
      `INSERT INTO PENITIP_PRODUK (NAMA_PENITIP, EMAIL_PENITIP, NO_TELP_PENITIP, ALAMAT_PENITIP) VALUES (?,?,?,?)`,
      [nama_penitip, email_penitip, no_telp_penitip, alamat_penitip]
    );

    return NextResponse.json({
      status: 201,
      message: "Berhasil menambah penitip",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const connection = await connect();

    const q = request.nextUrl.searchParams.get("q") || "";
    const orderBy = request.nextUrl.searchParams.get("orderBy") || "";
    const page = request.nextUrl.searchParams.get("page") || 1;

    let query = "SELECT * FROM PENITIP_PRODUK";

    if (q) {
      query += ` WHERE NAMA_PENITIP LIKE '%${q}%'`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    const offset = (Number(page) - 1) * 10;

    let total = 0;

    let [rows, fields] = await connection.execute(query);

    if (Array.isArray(rows)) {
      total = rows.length;
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    [rows, fields] = await connection.execute(query);

    return NextResponse.json({data: rows, totalData: total}, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
