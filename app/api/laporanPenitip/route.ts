import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection;
  try {
    connection = await connect();
    const date = request.nextUrl.searchParams.get("date") || "";
    const year = parseInt(date.split("-")[0], 10);
    const month = parseInt(date.split("-")[1], 10);

    if (isNaN(year) || isNaN(month)) {
      return {
        status: "fail",
        message: "Invalid date",
      };
    }

    const [results]: any = await connection.execute(
      `SELECT 
        penitip.NAMA_PENITIP, 
        produk.NAMA_PRODUK, 
        SUM(detil.JUMLAH_PESANAN) AS QTY, 
        produk.HARGA_PRODUK, 
        SUM(detil.subtotal) AS TOTAL, 
        SUM(detil.subtotal) * 0.20 AS KOMISI, 
        SUM(detil.subtotal) * 0.80 AS PENGHASILAN
    FROM 
        DETIL_TRANSAKSI AS detil
    JOIN 
        TRANSAKSI_PESANAN AS transaksi 
        ON detil.ID_TRANSAKSI_PESANAN = transaksi.ID_TRANSAKSI_PESANAN
    JOIN 
        PRODUK AS produk 
        ON detil.ID_PRODUK = produk.ID_PRODUK
    JOIN 
        PENITIP_PRODUK AS penitip 
        ON produk.ID_PENITIP_PRODUK = penitip.ID_PENITIP_PRODUK
    WHERE 
        YEAR(transaksi.TANGGAL_PESANAN) = ? 
        AND MONTH(transaksi.TANGGAL_PESANAN) = ? 
        AND transaksi.STATUS_PESANAN = 'Selesai'
        AND transaksi.STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi'
    GROUP BY 
        penitip.NAMA_PENITIP, 
        produk.NAMA_PRODUK, 
        produk.HARGA_PRODUK`,
      [year, month]
    );

    console.log(results);

    const object: any = {};

    results.forEach((result: any) => {
      if (object.hasOwnProperty(result.NAMA_PENITIP)) {
        object[result.NAMA_PENITIP].push({
          NAMA_PRODUK: result.NAMA_PRODUK,
          HARGA_PRODUK: result.HARGA_PRODUK,
          QTY: Number(result.QTY),
          TOTAL: Number(result.TOTAL),
          KOMISI: Number(result.KOMISI),
          PENGHASILAN: Number(result.PENGHASILAN),
        });
      } else {
        object[result.NAMA_PENITIP] = [
          {
            NAMA_PRODUK: result.NAMA_PRODUK,
            HARGA_PRODUK: result.HARGA_PRODUK,
            QTY: Number(result.QTY),
            TOTAL: Number(result.TOTAL),
            KOMISI: Number(result.KOMISI),
            PENGHASILAN: Number(result.PENGHASILAN),
          },
        ];
      }
    });

    console.log(object);

    return NextResponse.json(object || [], { status: 200 });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
