import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";

export async function POST(req: NextRequest) {
  try {
    const connection = await connect();
    const [karyawanRows] = await connection.query("SELECT * FROM KARYAWAN");

    const karyawanData = karyawanRows as any[];
    const values = karyawanData.map((row: any) => [row.ID_KARYAWAN, "Hadir"]);

    const placeholders = values.map(() => "(?, CURDATE(), ?)");
    const flattenedValues = values.flat();

    const query = `INSERT INTO PRESENSI_KARYAWAN (ID_KARYAWAN, TANGGAL_PRESENSI, STATUS_PRESENSI) VALUES ${placeholders}`;

    const [rows] = await connection.query(query, flattenedValues);

    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function GET(req: Request) {
  try {
    const connection = await connect();

    const queryGetPresensi = `SELECT * FROM PRESENSI_KARYAWAN AS PK JOIN KARYAWAN AS K ON PK.ID_KARYAWAN = K.ID_KARYAWAN WHERE PK.TANGGAL_PRESENSI = CURRENT_DATE()`;

    const [resultGetPresensi, fields] = await connection.execute(
      queryGetPresensi
    );
    connection.end();

    const final_result_presensi = parseResultQuery(resultGetPresensi);

    const data_presensi = {
      id_presensi_karyawan: JSON.parse(final_result_presensi)
        .ID_PRESENSI_KARYAWAN,
      id_karyawan: JSON.parse(final_result_presensi).ID_KARYAWAN,
      nama_karyawan: JSON.parse(final_result_presensi).NAMA_KARYAWAN,
      tanggal_presensi: JSON.parse(
        final_result_presensi
      ).TANGGAL_PRESENSI.split("T")[0],
      status_presensi: JSON.parse(final_result_presensi).STATUS_PRESENSI,
    };

    return new Response(
      JSON.stringify({ status: StatusCodesP3L.OK, data: data_presensi })
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
