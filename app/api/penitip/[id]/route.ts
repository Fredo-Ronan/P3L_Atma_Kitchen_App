import { connect } from "@/db";
import { QueryResult } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await request.json();

    const { nama_penitip, email_penitip, no_telp_penitip, alamat_penitip } =
      JSON.parse(res.body);

   
   
    const [isExistRows] = await connection.execute(
      `SELECT * FROM PENITIP_PRODUK WHERE ID_PENITIP_PRODUK = ?`,
      [params.id]
    );

    let user;

    if (Array.isArray(isExistRows)) {
      if (isExistRows.length <= 0) {
        return NextResponse.json({
          status: 404,
          message: "Penitip tidak ditemukan",
        });
      }
      
      //@ts-ignore
      user = isExistRows[0].EMAIL_PENITIP
    }

    const [existingRows] = await connection.execute(
        `SELECT * FROM PENITIP_PRODUK WHERE EMAIL_PENITIP = ?`,
        [email_penitip]
      );
  
      if (Array.isArray(existingRows)) {
        if (existingRows.length > 0 && email_penitip !== user) {
          return NextResponse.json({
            status: 400,
            message: "Email telah digunakan oleh penitip lain",
          });
        }
      }

    const [rows] = await connection.execute(
      `
    UPDATE PENITIP_PRODUK 
    SET NAMA_PENITIP = ?, 
        EMAIL_PENITIP = ?, 
        NO_TELP_PENITIP = ?, 
        ALAMAT_PENITIP = ? 
    WHERE ID_PENITIP_PRODUK = ?
`,
      [nama_penitip, email_penitip, no_telp_penitip, alamat_penitip, params.id]
    );

    return NextResponse.json({
      status: 200,
      message: "Berhasil update data penitip",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function DELETE(request: NextRequest, {params}: {params: {id: string}}){
    try {
      const connection = await connect();

      const [existingRows] = await connection.execute(`SELECT * FROM PENITIP_PRODUK WHERE ID_PENITIP_PRODUK = ?`, [
        params.id
      ])

      if(Array.isArray(existingRows)){
        if(existingRows.length <= 0) {
            return NextResponse.json({
                status: 404,
                message: "Penitip tidak ditemukan"
            })
        }
      }

      const [rows] = await connection.execute(`DELETE FROM PENITIP_PRODUK WHERE ID_PENITIP_PRODUK = ?`, [
        params.id
      ])

      return NextResponse.json({
        status: 200,
        message: "Berhasil menghapus data penitip"
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }