import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let connection: any;

  try {
    const connection = await connect();

    const [pesanan] = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_CUSTOMER = ? AND STATUS_TRANSAKSI = 'checkout, belum bayar'`,
      [id]
    );

    const ID_PESANAN: string[] = [];

    if (Array.isArray(pesanan)) {
      pesanan.forEach((element: any) => {
        ID_PESANAN.push(element.ID_TRANSAKSI_PESANAN);
      });
    }

    const tempDetilTransaksi = await Promise.all(
      ID_PESANAN.map(async (element: any) => {
        const [detilTransaksi] = await connection.execute(
          `SELECT * FROM DETIL_TRANSAKSI WHERE ID_TRANSAKSI_PESANAN = ?`,
          [element]
        );

        return detilTransaksi;
      })
    );

    const detilTransaksi = tempDetilTransaksi.flat();

    const ID_PRODUK: string[] = [];

    detilTransaksi.forEach((element: any) => {
      ID_PRODUK.push(element.ID_PRODUK);
    });

    const tempProduk = await Promise.all(
      ID_PRODUK.map(async (element: any) => {
        const [produk] = await connection.execute(
          `SELECT * FROM PRODUK WHERE ID_PRODUK = ?`,
          [element]
        );

        return produk;
      })
    );

    const produk = tempProduk.flat();

    if (Array.isArray(pesanan)) {
      pesanan.forEach((element: any) => {
        element.DETIL_TRANSAKSI = detilTransaksi.filter(
          (detil: any) =>
            detil.ID_TRANSAKSI_PESANAN === element.ID_TRANSAKSI_PESANAN
        );
      });

      pesanan.forEach((element: any) => {
        element.DETIL_TRANSAKSI.forEach((detil: any) => {
          detil.PRODUK = produk.filter(
            (produk: any) => produk.ID_PRODUK === detil.ID_PRODUK
          );
        });
      });
    }

    return NextResponse.json({
      status: 200,
      pesanan,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error.message });
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

    const res = await request.json();

    const { bukti_tf } = JSON.parse(res.body);

    const [isExist] = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    if (Array.isArray(isExist)) {
      if (isExist.length === 0) {
        connection.end();
        return NextResponse.json({
          status: 404,
          message: "Pesanan tidak ditemukan",
        });
      }
    }

    const [rows] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET BUKTI_TF = ? WHERE ID_TRANSAKSI_PESANAN = ?`,
      [bukti_tf, id]
    );

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengubah bukti transfer",
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ status: 500, message: error.message });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
