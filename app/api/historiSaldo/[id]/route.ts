import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await connect();

    const { id } = params;

    const [results] = await connection.execute(
      `SELECT * FROM PENARIKAN_SALDO  WHERE ID_CUSTOMER = ? AND STATUS = 'Dikonfirmasi'`,
      [id]
    );

    return NextResponse.json(results || [], { status: 200 });
  } catch (error) {
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
