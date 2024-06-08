import { connect } from "@/db";
import console from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const { id } = params;
    connection = await connect();
    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const [results]: any = await connection.execute(
      `SELECT SALDO FROM CUSTOMER WHERE ID_CUSTOMER = ?`,
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(results[0], { status: 200 });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await connect();
    const { id } = params;
    const data = await request.json();
    console.log(data);

    let jumlahSaldo: any;

    if (data.jumlahSaldo) {
      jumlahSaldo = data.jumlahSaldo;
    } else {
      jumlahSaldo = await JSON.parse(data.body).jumlahSaldo;
    }

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const date = new Date();

    await connection.execute(
      "INSERT INTO PENARIKAN_SALDO (ID_CUSTOMER, JUMLAH_SALDO_DITARIK, TANGGAL_PENARIKAN, STATUS) VALUES (?,?,?,?)",
      [id, jumlahSaldo, date, "diajukan"]
    );

    await connection.execute(
      "UPDATE CUSTOMER SET SALDO = SALDO - ? WHERE ID_CUSTOMER = ?",
      [jumlahSaldo, id]
    );

    return NextResponse.json({
      status: "success",
      message: "Saldo berhasil diajukan penarikan",
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await connect();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const [results]: any = await connection.execute(
      `UPDATE PENARIKAN_SALDO SET STATUS = 'Dikonfirmasi' WHERE ID_PENARIKAN_SALDO = ?`,
      [id]
    );

    if (results.length === 0)
      return NextResponse.json({ message: "Data not found" }, { status: 404 });

    return NextResponse.json({
      status: "success",
      message: "Saldo berhasil dikonfirmasi",
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
