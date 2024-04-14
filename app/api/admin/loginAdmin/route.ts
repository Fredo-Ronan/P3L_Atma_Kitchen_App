import { connect } from "@/db";

/*
    API ROUTE FOR CUSTOMER LOGIN
*/

export async function POST(req: Request){
    const connection = await connect();

    const body = await req.json();
    const usernameRequest = body.username;
    const passwordRequest = body.password;
    
    const [rows, fields] = await connection.execute(`SELECT k.id_karyawan, k.nama_karyawan, k.email_karyawan, k.alamat_karyawan 
                                                    FROM users u JOIN karyawan k ON u.ID_KARYAWAN=k.ID_KARYAWAN 
                                                    WHERE u.username LIKE '${usernameRequest}' AND u.password LIKE '${passwordRequest}'`);
    connection.end();

    const parsed_result = JSON.stringify(rows).replace('[', ''); // replace [ symbol in result query
    const final_result = parsed_result.replace(']', ''); // replace ] symbol in result query and become final 1 data in JSON only format not inside an Array

    // check if the user is found by cheking the final result value, and if it's empty then the user is not found
    if(final_result !== ''){
        return new Response(JSON.stringify({status: "OK", data: JSON.parse(final_result)}));
    }

    return new Response(JSON.stringify({status: "NOT OK", data: null}));
}