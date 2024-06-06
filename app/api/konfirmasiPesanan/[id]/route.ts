import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   let connection: any;

//   try {
//     const connection = await connect();

//     const [pesanan] = await connection.execute(
//       `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_CUSTOMER = ? AND STATUS_PESANAN = 'dibawa kurir' OR STATUS_PESANAN = 'pesanan siap diambil'`,
//       [id]
//     );

//     // const ID_PESANAN: string[] = [];

//     // if (Array.isArray(pesanan)) {
//     //   pesanan.forEach((element: any) => {
//     //     ID_PESANAN.push(element.ID_TRANSAKSI_PESANAN);
//     //   });
//     // }

//     let formattedPesanan: any[] = [];

//     if (Array.isArray(pesanan)) {
//       pesanan.forEach((row: any) => {
//         formattedPesanan.push({
//           id_transaksi_pesanan: row.ID_TRANSAKSI_PESANAN,
//           tanggal_pesanan: row.TANGGAL_PESANAN,
//           status_pesanan: row.STATUS_PESANAN,
//           status_transaksi: row.STATUS_TRANSAKSI,
//           tipe_pengiriman: row.TIPE_PENGIRIMAN,
//           alamat_pengiriman: row.ALAMAT_PENGIRIMAN,
//           no_transaksi: row.NO_TRANSAKSI,
//           total_item: row.TOTAL_ITEM,
//           total_harga: row.TOTAL_HARGA,
//         });
//       });

//     //   const resultGetPesananArray = resultPesanan as any[];

//     // const pesanan = resultGetPesananArray.map((row) => {
//     //   const jsonString = JSON.stringify(row);
//     //   const parsedRow = JSON.parse(jsonString);
//     //   return {
//     //     id_transaksi_pesanan: parsedRow.ID_TRANSAKSI_PESANAN,
//     //     tanggal_pesanan: parsedRow.TANGGAL_PESANAN,
//     //     status_pesanan: parsedRow.STATUS_PESANAN,
//     //     status_transaksi: parsedRow.STATUS_TRANSAKSI,
//     //     tipe_pengiriman: parsedRow.TIPE_PENGIRIMAN,
//     //     alamat_pengiriman: parsedRow.ALAMAT_PENGIRIMAN,
//     //     no_transaksi: parsedRow.NO_TRANSAKSI,
//     //     total_item: parsedRow.TOTAL_ITEM,
//     //     total_harga: parsedRow.TOTAL_HARGA,
//     //   };
//     // });
//     }
//     return NextResponse.json({
//       status: 200,
//       pesanan,
//     });
//   } catch (error: any) {
//     console.log(error);
//     return NextResponse.json({ status: 500, message: error.message });
//   } finally {
//     if (connection) {
//       connection.end();
//     }
//   }
// }

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let connection: any;
  try {
    const connection = await connect();

    const [resultGetPesanan] = await connection.execute(
      `SELECT * FROM TRANSAKSI_PESANAN WHERE ID_CUSTOMER = ? 
      AND STATUS_PESANAN = 'dibawa kurir' 
      OR STATUS_PESANAN = 'pesanan siap diambil'
      OR STATUS_PESANAN = 'selesai'`,
      [id]
    );

    connection.end();

    const resultGetPesananArray = resultGetPesanan as any[];

    const pesananData = resultGetPesananArray.map((row) => {
      const jsonString = JSON.stringify(row);
      const parsedRow = JSON.parse(jsonString);
      return {
        id_transaksi_pesanan: parsedRow.ID_TRANSAKSI_PESANAN,
        tanggal_pesanan: parsedRow.TANGGAL_PESANAN,
        status_pesanan: parsedRow.STATUS_PESANAN,
        status_transaksi: parsedRow.STATUS_TRANSAKSI,
        tipe_pengiriman: parsedRow.TIPE_PENGIRIMAN,
        alamat_pengiriman: parsedRow.ALAMAT_PENGIRIMAN,
        no_transaksi: parsedRow.NO_TRANSAKSI,
        total_item: parsedRow.TOTAL_ITEM,
        total_harga: parsedRow.TOTAL_HARGA,
      };
    });

    return new Response(
      JSON.stringify({ status: StatusCodesP3L.OK, data: pesananData })
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await connect();
    const res = await req.json();
    
    const [rows, fields] = await connection.execute(
      `UPDATE TRANSAKSI_PESANAN SET STATUS_PESANAN = 'selesai' WHERE ID_TRANSAKSI_PESANAN = ${params.id}`
    );

    connection.end();

    return NextResponse.json({
      status: 200,
      message: "Berhasil Mengubah Status Pesanan",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
