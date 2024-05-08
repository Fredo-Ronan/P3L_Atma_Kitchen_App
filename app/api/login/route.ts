import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import bcrypt from "bcryptjs";

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();
    const usernameRequest = body.username;
    const passwordRequest = body.password;

    const query = `SELECT ID_CUSTOMER, ID_KARYAWAN, PASSWORD, ACTIVE FROM ${TableListNames.USERS} WHERE USERNAME LIKE ?`;

    const [rows, fields] = await connection.execute(query, [usernameRequest]);

    // parse result query with custom function for easy acces to attribute
    const final_result = parseResultQuery(rows);

    // check if the user is found by cheking the final result value, and if it's empty then the user is not found
    if(final_result !== ''){
        if(JSON.parse(final_result).ACTIVE === 0){
            return new Response(JSON.stringify({status: StatusCodesP3L.NOT_VERIFIED, data: null}));
        }

        // check if the password is match with the hashed password using bcrypt compare method to compare hash accordig to bcrypt
        const isPasswordMatch = await bcrypt.compare(passwordRequest, JSON.parse(final_result).PASSWORD);

        if(isPasswordMatch){
            if(JSON.parse(final_result).ID_CUSTOMER !== null){
                // berarti yang login customer
                const queryCustomer = `SELECT ID_CUSTOMER, NAMA_CUSTOMER, EMAIL_CUSTOMER, TANGGAL_LAHIR, SALDO, TOTAL_POIN 
                                        FROM ${TableListNames.CUSTOMER} WHERE ID_CUSTOMER = ?`;
                const id_customer = JSON.parse(final_result).ID_CUSTOMER;

                const [resultCustomer, fieldsCustomer] = await connection.execute(queryCustomer, [id_customer]);
                connection.end();

                const final_customer_result = parseResultQuery(resultCustomer);

                const user_data_to_send = {
                    id_customer: JSON.parse(final_customer_result).ID_CUSTOMER,
                    nama_customer: JSON.parse(final_customer_result).NAMA_CUSTOMER,
                    email_customer: JSON.parse(final_customer_result).EMAIL_CUSTOMER,
                    tanggal_lahir: JSON.parse(final_customer_result).TANGGAL_LAHIR,
                    saldo: JSON.parse(final_customer_result).SALDO,
                    total_poin: JSON.parse(final_customer_result).TOTAL_POIN
                }

                return new Response(JSON.stringify({status: StatusCodesP3L.OK, role: "Customer", data: user_data_to_send}));
            } else {
                // berarti yang login karyawan (admin/mo)
                const queryKaryawan = `SELECT r.NAMA_ROLE, k.NAMA_KARYAWAN, k.EMAIL_KARYAWAN, k.ALAMAT_KARYAWAN, k.NO_TELP_KARYAWAN 
                                        FROM ${TableListNames.KARYAWAN} k JOIN ${TableListNames.ROLE} r 
                                        ON k.ID_ROLE=r.ID_ROLE WHERE k.ID_KARYAWAN = ?`;
                
                const id_karayawan = JSON.parse(final_result).ID_KARYAWAN;

                const [resultKaryawan, fieldsKaryawan] = await connection.execute(queryKaryawan, [id_karayawan]);

                const final_karyawan_result = parseResultQuery(resultKaryawan);

                const data_karyawan_to_send = {
                    role: JSON.parse(final_karyawan_result).NAMA_ROLE,
                    nama_karyawan: JSON.parse(final_karyawan_result).NAMA_KARYAWAN,
                    email_karyawan: JSON.parse(final_karyawan_result).EMAIL_KARYAWAN,
                    alamat_karyawan: JSON.parse(final_karyawan_result).ALAMAT_KARYAWAN,
                    no_telp_karyawan: JSON.parse(final_karyawan_result).NO_TELP_KARYAWAN
                }

                if(JSON.parse(final_karyawan_result).NAMA_ROLE === 'Manager Operasional'){
                    // berarti yang login karayawan bagian manager operasional dan set sessionnya nanti sebagai manager operasional
                    return new Response(JSON.stringify({status: StatusCodesP3L.OK, role: "MO", data: data_karyawan_to_send}));
                } else if(JSON.parse(final_karyawan_result).NAMA_ROLE === 'Admin') {
                    // berarti yang login karyawan bagian admin dan set sessionnya nanti sebagai admin
                    return new Response(JSON.stringify({status: StatusCodesP3L.OK, role: "Admin", data: data_karyawan_to_send}));
                } else {
                    return new Response(JSON.stringify({status: StatusCodesP3L.OK, role: "Owner", data: data_karyawan_to_send}));
                }
            }
        }
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.NOT_OK, data: null}));
}