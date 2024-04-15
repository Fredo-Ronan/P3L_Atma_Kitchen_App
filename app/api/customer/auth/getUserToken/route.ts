import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

/*
    ROUTE TO GET USER TOKEN TO VERIFY THE TOKEN FROM LINK SEND TO USER'S EMAIL
*/

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const query = `SELECT TOKEN FROM USERS WHERE ID_USERS = ?`;
    
    const [resultQuery, fields] = await connection.execute(query, [body.id_user]);

    // parse result query with custom function for easy acces to attribute
    const final_result = parseResultQuery(resultQuery);

    if(final_result === ''){
        return new Response(JSON.stringify({status: StatusCodesP3L.NOT_OK, data: null}));
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: resultQuery}));
}