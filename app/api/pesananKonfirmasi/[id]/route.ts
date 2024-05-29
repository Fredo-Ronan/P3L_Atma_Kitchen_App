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
      `SELECT * FROM DETIL_TRANSAKSI WHERE ID_TRANSAKSI_PESANAN = ?`,
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
      `UPDATE CUSTOMER SET SALDO = SALDO + ${pesanan[0].TOTAL_BAYAR_CUSTOMER} WHERE ID_CUSTOMER = ?`,
      [pesanan[0].ID_CUSTOMER]
    );

    await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_PESANAN = 'pesanan ditolak' WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    return NextResponse.json({
      status: "success",
      message: "Pesanan berhasil ditolak",
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection: any;
  try {
    connection = await connect();

    const { id } = params;
    const [pesanan]: any = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    if (Array.isArray(pesanan) && pesanan.length === 0) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // check if bahan baku is enough

    const bahanDibutuhkan: any = {};

    const [detilTransaksi]: any = await connection.execute(
      `SELECT * FROM DETIL_TRANSAKSI WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    const produkTemp = await Promise.all(
      detilTransaksi.map(async (detil: any) => {
        if (detil.ID_PRODUK !== null) {
          const [produk] = await connection.execute(
            `SELECT * FROM PRODUK WHERE ID_PRODUK = ?`,
            [detil.ID_PRODUK]
          );

          return produk;
        }
      })
    );

    const relasiHampersTemp = await Promise.all(
      detilTransaksi.map(async (detil: any) => {
        if (detil.ID_HAMPERS !== null) {
          const [relasiHamper] = await connection.execute(
            `SELECT * FROM RELASI_PRODUK_HAMPERS WHERE ID_HAMPERS = ?`,
            [detil.ID_HAMPERS]
          );
          return relasiHamper;
        }
      })
    );

    const relasiHampersResult = relasiHampersTemp
      .flat()
      .filter((relasi) => relasi !== undefined);

    let produkTemp2;

    if (relasiHampersResult.length !== 0) {
      produkTemp2 = await Promise.all(
        relasiHampersResult.map(async (relasi: any) => {
          const [produk] = await connection.execute(
            `SELECT * FROM PRODUK WHERE ID_PRODUK = ?`,
            [relasi.ID_PRODUK]
          );
          return {
            ...produk[0],
            ID_HAMPERS: relasi.ID_HAMPERS,
          };
        })
      );
    }

    const produkResultsHampers =
      produkTemp2?.flat().filter((produk) => produk !== undefined) || [];

    console.log("ini produk results hampers", produkResultsHampers);

    const produkResultsNoHampers = produkTemp.flat();

    const produkNoFilters = [
      ...produkResultsNoHampers,
      ...produkResultsHampers,
    ];

    const produktemp2 = produkNoFilters.filter(
      (produk: any) => produk !== undefined
    );

    const produkResults = produktemp2.filter(
      (produk) => produk.JENIS_PRODUK !== "Titipan"
    );

    console.log("ini produk results", produkResults);

    produkResults.forEach((produk: any) => {
      const index = detilTransaksi.findIndex(
        (detil: any) =>
          detil.ID_PRODUK === produk.ID_PRODUK ||
          detil.ID_HAMPERS === produk.ID_HAMPERS
      );
      if (detilTransaksi[index].KETERANGAN === "READY") {
        if (produk.STOK <= detilTransaksi[index].JUMLAH_PESANAN) {
          detilTransaksi[index].JUMLAH_PESANAN =
            detilTransaksi[index].JUMLAH_PESANAN - produk.STOK;
        } else {
          detilTransaksi[index].JUMLAH_PESANAN = 0;
        }
      }
    });

    const resepTemp = await Promise.all(
      produkResults.map(async (produk: any) => {
        const [resep] = await connection.execute(
          `SELECT * FROM RELASI_BAHAN_RESEP WHERE ID_RESEP = ?`,
          [produk.ID_RESEP]
        );

        resep.forEach((resep: any) => {
          resep.ID_PRODUK = produk.ID_PRODUK;
          resep.ID_HAMPERS = produk.ID_HAMPERS;
        });

        return resep;
      })
    );

    const resepResults = resepTemp.flat();

    console.log("ini resep results", resepResults);

    for (let i = 0; i < resepResults.length; i++) {
      if (resepResults[i].ID_HAMPERS !== undefined) {
        bahanDibutuhkan[resepResults[i].ID_BAHAN] =
          resepResults[i].JUMLAH_DIBUTUHKAN *
          detilTransaksi.find(
            (detil: any) => detil.ID_HAMPERS === resepResults[i].ID_HAMPERS
          ).JUMLAH_PESANAN;
      } else {
        bahanDibutuhkan[resepResults[i].ID_BAHAN] =
          resepResults[i].JUMLAH_DIBUTUHKAN *
          detilTransaksi.find(
            (detil: any) => detil.ID_PRODUK === resepResults[i].ID_PRODUK
          ).JUMLAH_PESANAN;
      }
    }

    console.log("ini bahan dibutuhkan", bahanDibutuhkan);

    const listKurangBahan = await Promise.all(
      Object.keys(bahanDibutuhkan).map(async (key) => {
        const [bahan] = await connection.execute(
          `SELECT * FROM BAHAN WHERE ID_BAHAN = ?`,
          [key]
        );
        if (bahan[0].STOK_BAHAN < bahanDibutuhkan[key]) {
          let bahanKurang = {
            ID_BAHAN: key,
            NAMA_BAHAN: bahan[0].NAMA_BAHAN,
            SATUAN: bahan[0].SATUAN,
            JUMLAH_KURANG: bahanDibutuhkan[key] - bahan[0].STOK_BAHAN,
          };
          return bahanKurang;
        }
      })
    );

    console.log("ini list kurang bahan", listKurangBahan);

    if (listKurangBahan.filter((bahan) => bahan !== undefined).length !== 0) {
      return NextResponse.json({
        status: "kurang",
        message: "Bahan baku tidak cukup",
        listKurangBahan: listKurangBahan.filter((bahan) => bahan !== undefined),
      });
    }

    const poin = pesanan[0].POIN;

    await connection.execute(
      `UPDATE CUSTOMER SET TOTAL_POIN = TOTAL_POIN + ${poin} WHERE ID_CUSTOMER = ?`,
      [pesanan[0].ID_CUSTOMER]
    );

    await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_PESANAN = 'pesanan diproses' WHERE ID_TRANSAKSI_PESANAN = ?`,
      [id]
    );

    return NextResponse.json({
      status: "success",
      message: "Pesanan berhasil dikonfirmasi",
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
