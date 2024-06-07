import { bulanFilter } from "@/constants/mapping";
import { connect } from "@/db";
import { NextRequest, NextResponse } from "next/server";

function monthParser(month: string | null){
    const monthNumber = [1,2,3,4,5,6,7,8,9,10,11,12];
    let finalMonthNumber = 0;

    if(!month || month === null) return null; 

    bulanFilter.forEach((data, index) => {
        if(month === data){
            finalMonthNumber = monthNumber[index];
        }
    })

    return finalMonthNumber;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const q = req.nextUrl.searchParams.get("q");
        const orderBy = req.nextUrl.searchParams.get("orderBy");
        let page = req.nextUrl.searchParams.get("page") || 1;
        const filter = req.nextUrl.searchParams.get("filter");

        const monthQuery = monthParser(filter);

        if(monthQuery === null){
            return NextResponse.json({
                data: null
            }, { status: 200 });
        }

        const queryGetLaporanBulananPerProduk = `
            SELECT
                PB.ID_PENGGUNAAN_BAHAN,
                PB.ID_BAHAN, 
                B.NAMA_BAHAN,
                PB.JUMLAH_DIGUNAKAN,
                PB.TANGGAL_DIGUNAKAN,
                B.SATUAN
            FROM PENGGUNAAN_BAHAN_BAKU PB 
            JOIN BAHAN B ON PB.ID_BAHAN = B.ID_BAHAN
            WHERE MONTH(PB.TANGGAL_DIGUNAKAN) = ${monthQuery};
        `

        const [result, fields] = await connection.execute(queryGetLaporanBulananPerProduk);
        connection.end();

        return NextResponse.json({
            data: result
        }, { status: 200 });
    }catch(error){
        console.log(error);
        throw error;
    }
}