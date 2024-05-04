import { NextRequest } from "next/server";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";

function parseDateToDay(date: string):string {
    return date.split("-")[2];
}

export async function GET(req: NextRequest){
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

        console.log(final_result_last_date);
        const last_date_to_reset = JSON.parse(final_result_last_date).LAST_TANGGAL.split("T")[0];
        const currentDate = new Date();
        const dayToReset = parseInt(parseDateToDay(last_date_to_reset)); // still testing for different time zones
        const dayNow = parseInt(parseDateToDay(currentDate.toISOString().split("T")[0]));
        console.log(last_date_to_reset);
        console.log(`Last date on database : ${dayToReset}`);
        console.log(`Current date : ${dayNow}`);
        const isSame = dayToReset === dayNow;

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: { dayToRest: dayToReset, dayNow: dayNow, isSame:  isSame}}));

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

        return new Response(JSON.stringify({status: StatusCodesP3L.OK}))
    }catch(error){
        console.log(error);
        throw error;
    }
}