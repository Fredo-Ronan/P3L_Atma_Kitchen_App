import { connect } from "@/db";
import { formatDateToYYYYMMDD } from "@/utilities/dateParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id_produk: string } }){
    try {
        const connection = await connect();

        const currentDate = new Date();

        const currentDateFinal = formatDateToYYYYMMDD(currentDate);

        const queryGetKuotaToday = `SELECT * FROM KUOTA_HARIAN WHERE ID_PRODUK = ? AND TANGGAL_KUOTA = ?`;

        const [resultGetKuotaToday, fields] = await connection.execute(queryGetKuotaToday, [params.id_produk, currentDateFinal]);
        connection.end();

        return NextResponse.json({
            kuotaProdukToday: resultGetKuotaToday
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}