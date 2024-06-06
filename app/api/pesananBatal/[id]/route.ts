import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await connect();
    const { id } = params;

    const [pesanan]: any = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN  WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    if (Array.isArray(pesanan) && pesanan.length === 0) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    const [detilTransaksi]: any = await connection.execute(
      `SELECT * FROM DETIL_TRANSAKSI WHERE ID_TRANSAKSI_PESANAN = ? GROUP BY ID_TRANSAKSI_PESANAN`,
      [id]
    );

    if (Array.isArray(detilTransaksi) && detilTransaksi.length !== 0) {
      for (const detil of detilTransaksi) {
        if (detil.ID_PRODUK !== null) {
          if (detil.KETERANGAN === "PREORDER") {
            await connection.execute(
              `UPDATE KUOTA_HARIAN SET KUOTA = KUOTA + ${detil.JUMLAH_PESANAN} WHERE ID_PRODUK = ? AND TANGGAL_KUOTA = ?`,
              [detil.ID_PRODUK, pesanan[0].TANGGAL_PENGIRIMAN]
            );
          } else if (detil.KETERANGAN === "READY") {
            await connection.execute(
              `UPDATE PRODUK SET STOK = STOK + ${detil.JUMLAH_PESANAN} WHERE ID_PRODUK = ?`,
              [detil.ID_PRODUK]
            );
          }
        } else if (detil.ID_HAMPERS !== null) {
          const [detilHampers]: any = await connection.execute(
            `SELECT * FROM RELASI_PRODUK_HAMPERS WHERE ID_HAMPERS = ?`,
            [detil.ID_HAMPERS]
          );

          if (Array.isArray(detilHampers) && detilHampers.length !== 0) {
            for (const produkHampers of detilHampers) {
              const [produk]: any = await connection.execute(
                `SELECT * FROM PRODUK WHERE ID_PRODUK = ?`,
                [produkHampers.ID_PRODUK]
              );

              if (produk[0].JENIS_PRODUK === "Titipan") {
                await connection.execute(
                  `UPDATE PRODUK SET STOK = STOK + ${detil.JUMLAH_PESANAN} WHERE ID_PRODUK = ?`,
                  [produkHampers.ID_PRODUK]
                );
              } else {
                await connection.execute(
                  `UPDATE KUOTA_HARIAN SET KUOTA = KUOTA + ${detil.JUMLAH_PESANAN} WHERE ID_PRODUK = ? AND TANGGAL_KUOTA = ?`,
                  [produkHampers.ID_PRODUK, pesanan[0].TANGGAL_PENGIRIMAN]
                );
              }
            }
          }
        }
      }
    }

    await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_TRANSAKSI = 'transaksi dibatalkan' WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    return NextResponse.json({
      status: "success",
      message: "Pesanan berhasil dibatalkan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (connection) {
      connection.end();
    }
  }
}