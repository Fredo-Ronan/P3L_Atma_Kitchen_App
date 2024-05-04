import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function GET(req: Request, { params }: { params: { params: string } }){
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

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, dateDatabase: lastDateOnly, current: currentDateOnly, isEarlier: isLastEarlier, isSame: isSame}));
    }catch(error){
        console.log(error);
        throw error;
    }
}