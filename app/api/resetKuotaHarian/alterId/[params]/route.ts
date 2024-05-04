import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";

export async function GET(req: Request, { params }: { params: { params: string } }){
    try {
        const connection = await connect();

        const queryAlter = `ALTER TABLE KUOTA_HARIAN AUTO_INCREMENT = 1`;

        const [resultAlter, fields] = await connection.execute(queryAlter);
        connection.end();

        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }catch(error){
        console.log(error);
        throw error;
    }
}