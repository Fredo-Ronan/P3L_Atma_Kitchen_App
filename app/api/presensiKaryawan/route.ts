import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await connect();
    const [karyawanRows] = await connection.query('SELECT * FROM KARYAWAN');
    
    const karyawanData = karyawanRows as any[];
    const values = karyawanData.map((row: any) => [row.ID_KARYAWAN, 'Hadir']);

    const placeholders = values.map(() => '(?, CURDATE(), ?)');
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



export async function GET(request: NextRequest) {
  try {
    const connection = await connect();

    const page = request.nextUrl.searchParams.get("page") || 1;
    const q = request.nextUrl.searchParams.get("q") || "";

    if (Number(page) <= 0 || isNaN(Number(page))) {
      connection.end();
      return NextResponse.json({ data: [], totalData: 0 });
    }

    let query = "SELECT * FROM PRESENSI_KARYAWAN AS PK JOIN KARYAWAN AS K ON PK.ID_KARYAWAN = K.ID_KARYAWAN WHERE PK.TANGGAL_PRESENSI = CURRENT_DATE()";

    if (q) {
      query += ` AND K.NAMA_KARYAWAN LIKE '%${q}%'`;
    }

    let totalData = 0;

    const offset = (Number(page) - 1) * 10;

    const [rows] = await connection.execute(query);

    if (Array.isArray(rows)) {
      if (rows.length === 0) {
        connection.end();
        return NextResponse.json({ data: [], totalData: 0 });
      }
      totalData = rows.length;
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    const [data] = await connection.execute(query);

    connection.end();

    return NextResponse.json({ data, totalData }, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
