import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,
  { params }: { params: { id: string }}) {
  try {
    const connection = await connect();

    const q = request.nextUrl.searchParams.get("q");
    const orderBy = request.nextUrl.searchParams.get("orderBy");
    let page = request.nextUrl.searchParams.get("page") || 1;
    // const filter = request.nextUrl.searchParams.get("filter");

    if (Number(page) <= 0 || isNaN(Number(page))) {
      connection.end();
      return NextResponse.json({ data: [], totalData: 0 });
    }

    let query = `SELECT RB.ID_RELASI_BAHAN_RESEP, B.NAMA_BAHAN, RB.JUMLAH_DIBUTUHKAN, RB.SATUAN
    FROM RELASI_BAHAN_RESEP AS RB
    JOIN BAHAN AS B ON RB.id_bahan = B.id_bahan
    JOIN RESEP AS R ON RB.id_resep = R.id_resep
    WHERE R.ID_RESEP = ${params.id}`;

    if (q) {
      query += ` AND B.NAMA_BAHAN LIKE '%${q}%'`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    const offset = (Number(page) - 1) * 10;

    let totalData = 0;

    let [rows, fields] = await connection.execute(query);

    if (Array.isArray(rows)) {
      totalData = rows.length;
    }

    if (totalData === 0) {
      connection.end();
      return NextResponse.json({ data: [], totalData });
    }

    query += ` LIMIT 10 OFFSET ${offset}`;

    [rows, fields] = await connection.execute(query);

    connection.end();

    return NextResponse.json(
      { data: rows, totalData },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string} }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { id_bahan, id_resep, jumlah_dibutuhkan, satuan} = JSON.parse(
      res.body
    );

    const [rows, fields] = await connection.execute(
      `UPDATE RELASI_BAHAN_RESEP SET ID_BAHAN = ${id_bahan}, ID_RESEP = ${id_resep}, 
      JUMLAH_DIBUTUHKAN = ${jumlah_dibutuhkan}, 
      SATUAN = '${satuan}' 
      WHERE ID_RELASI_BAHAN_RESEP = ${params.id}
      `
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil mengubah Detail Resep",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();

    const [rows, fields] = await connection.execute(
      "DELETE FROM RELASI_BAHAN_RESEP WHERE ID_RELASI_BAHAN_RESEP = ?",
      [params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus Bahan Resep",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}