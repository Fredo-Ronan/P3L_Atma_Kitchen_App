import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection;
  try {
    connection = await connect();

    console.log("masuk ke GET pesananKonfirmasi");
    const [results] = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN WHERE STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi' AND STATUS_PESANAN = 'pending'`
    );

    console.log(results);
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
