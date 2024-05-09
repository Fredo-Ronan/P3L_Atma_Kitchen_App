import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { id_role, nama_karyawan, email_karyawan, alamat_karyawan, no_telp_karyawan } = JSON.parse(
      res.body
    );
    
    const [rows, fields] = await connection.execute(
      `UPDATE KARYAWAN SET ID_ROLE = ${id_role}, NAMA_KARYAWAN = '${nama_karyawan}', EMAIL_KARYAWAN = '${email_karyawan}', 
      ALAMAT_KARYAWAN = '${alamat_karyawan}', NO_TELP_KARYAWAN = '${no_telp_karyawan}' WHERE ID_KARYAWAN = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Mengubah Karyawan",
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
      "DELETE FROM KARYAWAN WHERE ID_KARYAWAN = ?",
      [params.id]
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Menghapus Karyawan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }){
  try {
    const connection = await connect();

    const queryGetKaryawan = `SELECT r.NAMA_ROLE, k.NAMA_KARYAWAN, k.EMAIL_KARYAWAN, k.ALAMAT_KARYAWAN, k.NO_TELP_KARYAWAN 
                              FROM ${TableListNames.KARYAWAN} k JOIN ${TableListNames.ROLE} r 
                              ON k.ID_ROLE=r.ID_ROLE WHERE k.ID_KARYAWAN = ?`
    
    const [resultGetKaryawan, fields] = await connection.execute(queryGetKaryawan, [params.id]);

    const final_result_get_karyawan = parseResultQuery(resultGetKaryawan);

    const data_karyawan_to_send = {
      role: JSON.parse(final_result_get_karyawan).NAMA_ROLE,
      id_karyawan: JSON.parse(final_result_get_karyawan).ID_KARYAWAN,
      nama_karyawan: JSON.parse(final_result_get_karyawan).NAMA_KARYAWAN,
      email_karyawan: JSON.parse(final_result_get_karyawan).EMAIL_KARYAWAN,
      alamat_karyawan: JSON.parse(final_result_get_karyawan).ALAMAT_KARYAWAN,
      no_telp_karyawan: JSON.parse(final_result_get_karyawan).NO_TELP_KARYAWAN
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: data_karyawan_to_send}));
  }catch(error){
    console.log(error);
    throw error;
  }
}

