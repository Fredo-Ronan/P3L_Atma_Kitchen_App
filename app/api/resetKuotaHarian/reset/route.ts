import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { getNext7Days } from "@/utilities/nextNdays";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();

        const { arrayOfIdProduk } = JSON.parse(request.body);

        // get next 7 days dates
        const next7days = getNext7Days();

        // inserting default kuota to KUOTA_HARIAN for the next 7 days for each produk
        
        const batchSize = 50; // Example batch size
        const values = arrayOfIdProduk.flatMap((dataIdProduk: any) =>
            next7days.map((date) => [dataIdProduk, date.toISOString().split("T")[0], 20])
        );

        const insertKuotaSeminggu = (data: any) => `INSERT INTO KUOTA_HARIAN (ID_PRODUK, TANGGAL_KUOTA, KUOTA) VALUES ${data.map(() => '(?, ?, ?)').join(', ')}`;

        // Insert data in smaller batches
        for (let i = 0; i < values.length; i += batchSize) {
            const batch = values.slice(i, i + batchSize);
            await connection.execute(insertKuotaSeminggu(batch), batch.flat());
        }
        connection.end();


        return new Response(JSON.stringify({status: StatusCodesP3L.OK, tanggalNextUpdate: next7days[next7days.length - 1]}));
    }catch(error){
        console.log(error);
        throw error;
    }
}