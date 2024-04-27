import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const username = body.username;

    const queryUsername = `SELECT ID_USERS FROM ${TableListNames.USERS} WHERE USERNAME LIKE ?`;

    const [resultQueryUsername, fields] = await connection.execute(queryUsername, [username]);
    connection.end();

    const final_result_username = parseResultQuery(resultQueryUsername);

    if(final_result_username !== ''){
        // brarti usernamenya ada dan valid
        const data_to_send = {
            id_users: JSON.parse(final_result_username).ID_USERS
        }

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: data_to_send}));
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.NOT_OK, data: null}));
}