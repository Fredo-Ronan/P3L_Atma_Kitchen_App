import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const id_users = body.id_users;
    const password = body.password;

    const queryUpdatePassword = `UPDATE ${TableListNames.USERS} SET PASSWORD = ? WHERE ID_USERS = ?`;

    const [resultUpdatePassword, fields] = await connection.execute(queryUpdatePassword, [password, id_users]);
    connection.end();

    const final_result_update = parseResultQuery(resultUpdatePassword);

    if(JSON.parse(final_result_update).affectedRows === 1){
        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.NOT_OK, data: JSON.parse(final_result_update)}));
}