import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();
    const emailReq = body.email;

    const queryCheckEmail = `SELECT EMAIL_CUSTOMER FROM CUSTOMER WHERE EMAIL_CUSTOMER LIKE ?`;

    const [resultCheckEmail, fields] = await connection.execute(queryCheckEmail, [emailReq]);
    connection.end();

    const final_result = parseResultQuery(resultCheckEmail);

    if(final_result !== ''){
        return new Response(JSON.stringify({status: StatusCodesP3L.NOT_OK}));
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
}