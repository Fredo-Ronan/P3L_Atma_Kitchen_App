import { connect } from "@/db";

export async function GET(req: Request){
    const connection = await connect();
    const [rows, fields] = await connection.execute("SELECT * FROM CUSTOMER");
    connection.end();
    return new Response(JSON.stringify({status: "OK", data: rows}));
}