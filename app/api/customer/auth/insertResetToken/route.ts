import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();

    const token = body.token;
    const id_customer = body.id_customer;

    const updateTokenQuery = `UPDATE USERS SET TOKEN = ? WHERE ID_CUSTOMER = ?`;

    const [resultUpdate, fields] = await connection.execute(updateTokenQuery, [token, id_customer]);
    connection.end();

    console.log(resultUpdate);

    return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
}