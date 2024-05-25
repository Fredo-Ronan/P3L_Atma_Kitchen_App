import { connect } from "@/db";
import { formatDateToYYYYMMDD } from "@/utilities/dateParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id_produk: string } }){
    try {
        const connection = await connect();

        const q = req.nextUrl.searchParams.get("q");
        const orderBy = req.nextUrl.searchParams.get("orderBy");
        const filter = req.nextUrl.searchParams.get("filter");

        // dari proses ini
        const currentDate = new Date();
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // sampai sini sebenarnya tidak perlu, karena kita hanya mengandalkan parameter filter saja

        let currentDateFinal = formatDateToYYYYMMDD(tomorrow);

        if(filter !== null){
            currentDateFinal = filter;
        } else {
            return NextResponse.json({
                kuotaProdukToday: null
            }, { status: 200 });
        }

        // console.log("CURRENT DATE " + currentDateFinal);

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

export async function POST(req: NextRequest, { params }: { params: { id_produk: string } }){
    try {
        const connection = await connect();

        const request = await req.json();
        const { tanggalKuota } = JSON.parse(request.body);

        const queryUpdateKuota = `UPDATE KUOTA_HARIAN SET KUOTA = KUOTA - 1 WHERE ID_PRODUK = ? AND TANGGAL_KUOTA = ?`;

        const [resultUpdateKuota, fields] = await connection.execute(queryUpdateKuota, [params.id_produk, tanggalKuota]);
        connection.end();

        return NextResponse.json({
            data: "OK"
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}