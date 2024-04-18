import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const password = body.password;
    const id_customer = body.id_customer;

    const changePasswordQuery = `UPDATE USERS SET PASSWORD = ? WHERE ID_CUSTOMER = ?`;

    const [resultChangePassword, fields] = await connection.execute(changePasswordQuery, [password, id_customer]);
    connection.end();

    return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
}