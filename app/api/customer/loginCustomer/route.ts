import { TableListNames } from "@/constants/tableNames";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import bcrypt from "bcryptjs";

/*
    API ROUTE TO LOGIN CUSTOMER/USERS
*/

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();
    const usernameRequest = body.username;
    const passwordRequest = body.password;

    const query = `SELECT c.ID_CUSTOMER, c.NAMA_CUSTOMER, c.EMAIL_CUSTOMER, c.TANGGAL_LAHIR, c.SALDO, c.TOTAL_POIN, u.ACTIVE, u.PASSWORD 
                    FROM ${TableListNames.USERS} u JOIN ${TableListNames.CUSTOMER} c ON u.ID_CUSTOMER=c.ID_CUSTOMER 
                    WHERE u.USERNAME LIKE ?`;
    
    const [rows, fields] = await connection.execute(query, [usernameRequest]);
    connection.end();

    // parse result query with custom function for easy acces to attribute
    const final_result = parseResultQuery(rows);

    // check if the user is found by cheking the final result value, and if it's empty then the user is not found
    if(final_result !== ''){

        if(JSON.parse(final_result).ACTIVE === 0){
            return new Response(JSON.stringify({status: "NOT VERIFIED", data: null}));
        }

        // check if the password is match with the hashed password using bcrypt compare method to compare hash accordig to bcrypt
        const isPasswordMatch = await bcrypt.compare(passwordRequest, JSON.parse(final_result).PASSWORD);
        
        if(isPasswordMatch){
            const user_data_to_send = {
                id_customer: JSON.parse(final_result).ID_CUSTOMER,
                nama_customer: JSON.parse(final_result).NAMA_CUSTOMER,
                email_customer: JSON.parse(final_result).EMAIL_CUSTOMER,
                tanggal_lahir: JSON.parse(final_result).TANGGAL_LAHIR,
                saldo: JSON.parse(final_result).SALDO,
                total_poin: JSON.parse(final_result).TOTAL_POIN
            }
            return new Response(JSON.stringify({status: "OK", data: user_data_to_send})); 
        }
    }


    return new Response(JSON.stringify({status: "NOT OK", data: null}));
}