import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function GET(req: Request, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        const queryGetCustomer = `SELECT * FROM CUSTOMER WHERE ID_CUSTOMER = ?`;
        
        const [resultGetCustomer, fields] = await connection.execute(queryGetCustomer, [params.id]);
        connection.end();

        const final_result_customer = parseResultQuery(resultGetCustomer);

        const data_customer_to_send = {
            id_customer: JSON.parse(final_result_customer).ID_CUSTOMER,
            nama_customer: JSON.parse(final_result_customer).NAMA_CUSTOMER,
            email_customer: JSON.parse(final_result_customer).EMAIL_CUSTOMER,
            tanggal_lahir: JSON.parse(final_result_customer).TANGGAL_LAHIR.split("T")[0],
            telepon: JSON.parse(final_result_customer).TELEPON,
            saldo: JSON.parse(final_result_customer).SALDO,
            total_poin: JSON.parse(final_result_customer).TOTAL_POIN
        }

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: data_customer_to_send}));
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function PUT(req: Request, { params, body }: { params: { id: string }, body: any }){
    try {
        const connection = await connect();

        const { nama_customer, email_customer, tanggal_lahir, telepon} = body;

        const queryUpdateCustomer = `
            UPDATE CUSTOMER 
            SET NAMA_CUSTOMER = ?, EMAIL_CUSTOMER = ?, TANGGAL_LAHIR = ?, TELEPON = ?
            WHERE ID_CUSTOMER = ?
        `;
        
        await connection.execute(queryUpdateCustomer, [nama_customer, email_customer, tanggal_lahir, telepon, params.id]);
        connection.end();

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, message: "Data customer berhasil diupdate"}));
    } catch(error) {
        console.log(error);
        throw error;
    }
}