import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const connection = await connect();

//     const res = await request.json();
//     const { nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran } =
//       JSON.parse(res.body);

//     const [isExist] = await connection.execute(
//       `SELECT * FROM PENGELUARAN_LAIN WHERE ID_PENGELUARAN_LAIN = ?`,
//       [params.id]
//     );

//     if (Array.isArray(isExist)) {
//       if (isExist.length === 0) {
//         connection.end();
//         return NextResponse.json({
//           status: 404,
//           message: "Pengeluaran lain tidak ditemukan",
//         });
//       }
//     }

//     const [rows] = await connection.execute(
//       `UPDATE PENGELUARAN_LAIN SET NAMA_PENGELUARAN = ?, BIAYA_PENGELUARAN = ?, TANGGAL_PENGELUARAN = ? WHERE ID_PENGELUARAN_LAIN = ?`,
//       [nama_pengeluaran, biaya_pengeluaran, tanggal_pengeluaran, params.id]
//     );

//     connection.end();

//     return NextResponse.json({
//       status: 200,
//       message: "Berhasil mengubah pengeluaran lain",
//     });
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    const { id_karyawan, tanggal_pemberian, bonus} = JSON.parse(
      res.body
    );

    const [isExist] = await connection.execute(
      `SELECT * FROM BONUS WHERE ID_BONUS = ?`,
      [params.id]
    );

    if (Array.isArray(isExist)) {
      if (isExist.length === 0) {
        connection.end();
        return NextResponse.json({
          status: 404,
          message: "Bonus tidak ditemukan",
        });
      }
    }

    const [rows] = await connection.execute(
      `UPDATE BONUS SET ID_KARYAWAN = ?, TANGGAL_PEMBERIAN = ?, BONUS = ?  WHERE ID_BONUS = ?`,
      [id_karyawan, tanggal_pemberian, bonus, params.id]
    );
    
    // const [rows, fields] = await connection.execute(
    //   `UPDATE BONUS SET ID_KARYAWAN = ${id_karyawan}, TANGGAL_PEMBERIAN = ${tanggal_pemberian}, BONUS = ${bonus}
    //    WHERE ID_BONUS = ${params.id}`
    // );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Mengubah Bonus Karyawan",
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
        "DELETE FROM BONUS WHERE ID_BONUS = ?",
        [params.id]
      );
  
      connection.end();
  
      return NextResponse.json({
        status: 200,
        message: "Berhasil Menghapus Bonus Karyawan",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  