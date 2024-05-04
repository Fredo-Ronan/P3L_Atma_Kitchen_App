import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { getNext7Days } from "@/utilities/nextNdays";

export async function GET(req: NextRequest, { params }: { params: { params: string } }){
    try {
        const connection = await connect();

        // get tanggal seharusnya di reset kuota hariannya
        const getLastDateQuery = `SELECT * FROM TANGGAL_LAST_KUOTA`;
        const [resultLastDate, fieldsLast] = await connection.execute(getLastDateQuery);

        const final_result_last_date = parseResultQuery(resultLastDate);

        if(final_result_last_date === ""){
            // berarti tidak ada yang harus di reset
            return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
        }

        // console.log(final_result_last_date);
        const last_date_to_reset = JSON.parse(final_result_last_date).LAST_TANGGAL.split("T")[0];
        const currentDate = new Date();
        // const dayToReset = parseInt(parseDateToDay(last_date_to_reset)); // still testing for different time zones
        // const dayNow = parseInt(parseDateToDay(currentDate.toISOString().split("T")[0]));
        // const isSame = dayToReset === dayNow;
        const lastDate = new Date(last_date_to_reset);

        const lastDateOnly = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

        const isLastEarlier = lastDateOnly < currentDateOnly;
        const isSame = lastDateOnly.getTime() === currentDateOnly.getTime();
        
        // console.log(last_date_to_reset);
        // console.log(`Last date on database : ${dayToReset}`);
        // console.log(`Current date : ${dayNow}`);
        // return NextResponse.json({data: { last: lastDate, current: currentDate, isEarlier: isLastEarlier, isSame: isSame }}, { status: 200, headers: {
        //     "Cache-Control": "no-cache, no-store, must-revalidate",
        // }, });

        if(isSame){
            // get all produk
            const getAllProdukQuery = `SELECT ID_PRODUK FROM PRODUK`;
    
            const [resultAllProduk, fieldsProduk] = await connection.execute(getAllProdukQuery);
    
            const final_result_all_produk = parseResultQuery(resultAllProduk);
            const arrayOfIdProdukJSON = final_result_all_produk.split(",");
            let arrayOfIdProdukFinal: number[] = [];
            
            arrayOfIdProdukJSON.forEach((element, index) => {
                arrayOfIdProdukFinal.push(
                    parseInt(element.split(":")[1].split("}")[0])
                );
            })
    
            console.log(arrayOfIdProdukFinal);

            // hapus semua data di tabel kuota harian
            const deleteAllKuotaQuery = `DELETE FROM KUOTA_HARIAN`;
            const [resultDelete, fieldsDelete] = await connection.execute(deleteAllKuotaQuery);

            // get next 7 days dates
            const next7days = getNext7Days();

            // inserting default kuota to KUOTA_HARIAN for the next 7 days for each produk
            arrayOfIdProdukFinal.forEach((dataIdProduk, index) => {
                next7days.forEach(async (date, index) => {
                  const insertKuotaSeminggu = `INSERT INTO KUOTA_HARIAN (ID_PRODUK, TANGGAL_KUOTA, KUOTA) VALUES (?,?,?)`;
          
                  const [resultInsertKuota, fieldsKuota] = await connection.execute(insertKuotaSeminggu, [dataIdProduk, date.toISOString().split("T")[0], 20]);
    
                  console.log(resultInsertKuota);
                })
            })
        }


        return new Response(JSON.stringify({status: StatusCodesP3L.OK}))
    }catch(error){
        console.log(error);
        throw error;
    }
}