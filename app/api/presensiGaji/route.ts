import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any;
  try {
    connection = await connect();
    const date = request.nextUrl.searchParams.get("date") || "";
    const year = parseInt(date.split("-")[0], 10);
    const month = parseInt(date.split("-")[1], 10);

    if (!isNaN(year) && !isNaN(month)) {
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
      return NextResponse.json(data || [], { status: 200 });
    }

    return NextResponse.json({
      status: "fail",
      message: "Invalid date",
    }, { status: 200 });
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
