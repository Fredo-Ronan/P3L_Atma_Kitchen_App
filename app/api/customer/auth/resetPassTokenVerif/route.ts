import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const token = body.token;

    // check is the token is valid with the token on the database
    const checkTokenQuery = `SELECT ID_CUSTOMER FROM USERS WHERE TOKEN LIKE ?`;

    const [resultCheckToken, fields] = await connection.execute(checkTokenQuery, [token]);

    const final_result_check_token = parseResultQuery(resultCheckToken);
    connection.end();

    // if the token is not valid, then response with NOT OK
    if(final_result_check_token === ''){
        return new Response(JSON.stringify({status: StatusCodesP3L.NOT_OK}));
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
}