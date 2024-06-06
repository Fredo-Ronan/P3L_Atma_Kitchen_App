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
                p.NAMA_PRODUK,
                tp.TANGGAL_PESANAN,
                COUNT(dt.ID_PRODUK) as JUMLAH_TERJUAL,
                p.HARGA_PRODUK,
                p.HARGA_PRODUK * COUNT(dt.id_produk) as JUMLAH_UANG
            FROM DETIL_TRANSAKSI dt
            JOIN TRANSAKSI_PESANAN tp ON dt.ID_TRANSAKSI_PESANAN=tp.ID_TRANSAKSI_PESANAN
            JOIN PRODUK p ON dt.ID_PRODUK=p.ID_PRODUK
            WHERE MONTH(tp.TANGGAL_PESANAN) = ${monthQuery}
            GROUP BY p.NAMA_PRODUK;
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