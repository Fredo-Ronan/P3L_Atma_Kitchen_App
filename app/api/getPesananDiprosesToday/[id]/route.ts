import { connect } from "@/db";
import { formatDateToYYYYMMDD, getDateTomorrow } from "@/utilities/dateParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const currentDate = formatDateToYYYYMMDD(new Date());
        const tomorrowDate = getDateTomorrow();

        const queryGetPesananDiprosesToday = `SELECT * FROM TRANSAKSI_PESANAN WHERE DATE(TANGGAL_PENGIRIMAN) >= DATE('${currentDate}') AND DATE(TANGGAL_PENGIRIMAN) <= DATE('${tomorrowDate}') AND STATUS_TRANSAKSI = 'checkout, pembayaran terkonfirmasi';`;

        const [result, fields] = await connection.execute(queryGetPesananDiprosesToday);
        connection.end();

        return NextResponse.json({
            dataPesanan: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}