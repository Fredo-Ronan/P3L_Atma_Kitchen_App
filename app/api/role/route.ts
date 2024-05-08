import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const connection = await connect();
    let query = "SELECT * FROM ROLE";
    let total = 0;

    let [rows, fields] = await connection.execute(query);

    if (Array.isArray(rows)) {
      total = rows.length;
    }

    if (total === 0) {
      connection.end();
      return NextResponse.json({ data: [], totalData: 0 });
    }

    [rows, fields] = await connection.execute(query);

    connection.end();
    return NextResponse.json({ data: rows, totalData: total }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
