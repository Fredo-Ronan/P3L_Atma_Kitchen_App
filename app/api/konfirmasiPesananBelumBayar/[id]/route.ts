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

    const [pesanan] = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_TRANSAKSI_PESANAN = ? AND STATUS_TRANSAKSI = 'checkout, belum bayar'`,
      [id]
    );

    if (Array.isArray(pesanan)) {
      if (pesanan.length <= 0) {
        return NextResponse.json({
          status: "fail",
          message: "Pesanan tidak ditemukan",
        });
      }
    }

    return NextResponse.json({
      status: "success",
      pesanan,
    });
  } catch (error) {
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

    const [pesanan] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET BUKTI_TF = ? WHERE ID_TRANSAKSI_PESANAN = ?`,
      [null, id]
    );

    return NextResponse.json({
      status: "success",
      message: "Berhasil menghapus bukti transfer",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "fail",
      message: "Gagal konfirmasi pesanan",
    });
  } finally {
    if (connection) connection.end();
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
    const res = await request.json();
    const { bukti_tf } = JSON.parse(res.body);

    const [pesanan] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_TRANSAKSI = 'checkout, menunggu konfirmasi pembayaran' WHERE ID_TRANSAKSI_PESANAN = ? AND STATUS_TRANSAKSI = 'checkout, belum bayar' AND BUKTI_TF = ?`,
      [id, bukti_tf]
    );

    return NextResponse.json({
      status: "success",
      message: "Berhasil mengkonfirmasi pesanan",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "fail",
      message: "Gagal konfirmasi pesanan",
    });
  } finally {
    if (connection) connection.end();
  }
}
