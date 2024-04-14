import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";

/*
    API ROUTE TO ACTIVATE USER IF THE TOKEN IS VALID
*/

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const query = `UPDATE ${TableListNames.USERS} SET ACTIVE = 1 WHERE ID_USERS = ?`;
    
    const [resultUpdate, fields] = await connection.execute(query, [body.user_id]);
    connection.end();

    return new Response(JSON.stringify({status: "OK", data: null}));
}