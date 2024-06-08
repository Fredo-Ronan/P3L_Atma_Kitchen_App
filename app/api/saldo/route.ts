import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let connection;
  try {
    connection = await connect();

    const [results] = await connection.execute(
      `SELECT * FROM PENARIKAN_SALDO  WHERE STATUS = 'diajukan'`
    );

    return NextResponse.json(results || [], { status: 200 });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
