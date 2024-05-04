import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    try {
        const connection = await connect();

        const request = await req.json();
        const { tanggalNextUpdate } = JSON.parse(request.body);

        const queryUpdate = `UPDATE TANGGAL_LAST_KUOTA SET LAST_TANGGAL = ?`;

        const [resultUpdate, fields] = await connection.execute(queryUpdate, [tanggalNextUpdate]);
        connection.end();

        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }catch(error){
        console.log(error);
        throw error;
    }
}