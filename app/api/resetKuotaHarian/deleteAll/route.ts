import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";

export async function DELETE(req: Request){
    try {
        const connection = await connect();

        // hapus semua data di tabel kuota harian
        const deleteAllKuotaQuery = `DELETE FROM KUOTA_HARIAN`;
        const [resultDelete, fieldsDelete] = await connection.execute(deleteAllKuotaQuery);
        connection.end();

        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }catch(error){
        console.log(error);
        throw error;
    }
}