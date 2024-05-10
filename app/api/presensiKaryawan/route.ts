import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";

export async function POST(req: NextRequest) {
  try {
    const connection = await connect();

    const [karyawanRows] = await connection.query("SELECT * FROM KARYAWAN");
    const karyawanData = karyawanRows as any[];

    const values: any[] = [];

    for (const row of karyawanData) {
      const karyawanId = row.ID_KARYAWAN;
      
      const existingRowsResult = await connection.query(
        "SELECT * FROM PRESENSI_KARYAWAN WHERE ID_KARYAWAN = ? AND TANGGAL_PRESENSI = CURDATE()",
        [karyawanId]
      );

      const existingRows = existingRowsResult[0] as any[];

      if (Array.isArray(existingRows) && existingRows.length === 0) {
        values.push([karyawanId, "Hadir"]);
      }
    }

    if (values.length === 0) {
      return new Response(JSON.stringify({ message: "Data presensi sudah ada" }), {
        status: 400,
      });
    }

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

    const resultGetPresensiArray = resultGetPresensi as any[];

    const presensiData = resultGetPresensiArray.map((row) => {
      const jsonString = JSON.stringify(row);
      const parsedRow = JSON.parse(jsonString);
      return {
        id_presensi_karyawan: parsedRow.ID_PRESENSI_KARYAWAN,
        id_karyawan: parsedRow.ID_KARYAWAN,
        nama_karyawan: parsedRow.NAMA_KARYAWAN,
        tanggal_presensi: parsedRow.TANGGAL_PRESENSI.split("T")[0],
        status_presensi: parsedRow.STATUS_PRESENSI,
      };
    });

    return new Response(
      JSON.stringify({ status: StatusCodesP3L.OK, data: presensiData })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

