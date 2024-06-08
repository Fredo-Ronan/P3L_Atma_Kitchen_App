import { connect } from "@/db";
import console from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any;
  try {
    connection = await connect();
    const date = request.nextUrl.searchParams.get("date") || "";

    console.log(date);
    const year = parseInt(date.split("-")[0], 10);
    const month = parseInt(date.split("-")[1], 10);

    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json({
        status: "fail",
        message: "Invalid date",
      });
    }

    const [transaksiPesanan] = await connection.execute(
      `SELECT SUM(TOTAL_HARGA) AS TOTAL_HARGA FROM TRANSAKSI_PESANAN WHERE YEAR(TANGGAL_PESANAN) = ? AND MONTH(TANGGAL_PESANAN) = ? AND STATUS_PESANAN = 'Selesai' GROUP BY YEAR(TANGGAL_PESANAN), MONTH(TANGGAL_PESANAN)`,
      [year, month]
    );

    console.log("ini pemasukan", transaksiPesanan);

    const [pengeluaran] = await connection.execute(
      `SELECT NAMA_PENGELUARAN, SUM(BIAYA_PENGELUARAN) AS BIAYA_PENGELUARAN FROM PENGELUARAN_LAIN WHERE YEAR(TANGGAL_PENGELUARAN) = ? AND MONTH(TANGGAL_PENGELUARAN) = ? GROUP BY NAMA_PENGELUARAN`,
      [year, month]
    );

    console.log(pengeluaran);

    const [tip] = await connection.execute(
      `SELECT SUM(t.JUMLAH_TIP) AS TOTAL_TIP FROM TIP AS t JOIN TRANSAKSI_PESANAN AS tp ON t.ID_TRANSAKSI_PESANAN = tp.ID_TRANSAKSI_PESANAN WHERE YEAR(tp.TANGGAL_PESANAN) = ? AND MONTH(tp.TANGGAL_PESANAN) = ? AND tp.STATUS_PESANAN = 'Selesai' GROUP BY YEAR(tp.TANGGAL_PESANAN), MONTH(tp.TANGGAL_PESANAN)`,
      [year, month]
    );

    console.log("ini tip", tip);

    const [results]: any = await connection.execute(
      `SELECT p.ID_KARYAWAN, k.NAMA_KARYAWAN, COUNT(CASE WHEN p.STATUS_PRESENSI = 'Hadir' THEN 1 END) AS JUMLAH_HADIR, COUNT(CASE WHEN p.STATUS_PRESENSI = 'Tidak Hadir' THEN 1 END) AS JUMLAH_BOLOS FROM PRESENSI_KARYAWAN AS p JOIN KARYAWAN AS k ON p.ID_KARYAWAN = k.ID_KARYAWAN WHERE YEAR(p.TANGGAL_PRESENSI) = ? AND MONTH(p.TANGGAL_PRESENSI) = ? GROUP BY k.NAMA_KARYAWAN`,
      [year, month]
    );

    const data = await Promise.all(
      results.map(async (result: any) => {
        const [bonus]: any = await connection.execute(
          `SELECT BONUS FROM BONUS WHERE ID_KARYAWAN = ? AND YEAR(TANGGAL_PEMBERIAN) = ?  AND MONTH (TANGGAL_PEMBERIAN) = ?`,
          [result.ID_KARYAWAN, year, month]
        );

        const bonuses = bonus
          .flat()
          .reduce((acc: any, curr: any) => acc + curr.BONUS, 0);

        return {
          namaKaryawan: result.NAMA_KARYAWAN,
          jumlahHadir: result.JUMLAH_HADIR,
          jumlahBolos: result.JUMLAH_BOLOS,
          honorHarian: result.JUMLAH_HADIR * 100000,
          bonusRajin: bonuses,
          totalGaji: result.JUMLAH_HADIR * 100000 + bonuses,
        };
      })
    );

    const totalGaji = data.reduce(
      (acc: any, curr: any) => acc + curr.totalGaji,
      0
    );

    pengeluaran?.forEach((item: any) => {
      item.BIAYA_PENGELUARAN = Number(item.BIAYA_PENGELUARAN);
    });

    console.log("ini gaji", totalGaji);
    const finalResult = {
      pengeluaranLain: pengeluaran || [],
      pemasukan: Number(transaksiPesanan[0]?.TOTAL_HARGA) || 0,
      tip: Number(tip[0]?.TOTAL_TIP) || 0,
      gajiKaryawan: totalGaji || 0,
    };

    console.log(finalResult);

    return NextResponse.json(finalResult, { status: 200 });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) connection.end();
  }
}
