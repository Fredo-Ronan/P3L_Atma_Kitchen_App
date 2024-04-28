import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryDelete = `DELETE FROM PRODUK WHERE ID_PRODUK = ?`;

        const [resultDelete, fields] = await connection.execute(queryDelete, [params.id]);

        connection.end();

        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();
        
        const query = `SELECT GAMBAR_PRODUK FROM PRODUK WHERE ID_PRODUK = ?`;

        const [result, fields] = await connection.execute(query, [params.id]);
        connection.end();

        const final_result = parseResultQuery(result);

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: JSON.parse(final_result)}));
    }catch(error){
        console.log(error);
        throw error;
    }
}