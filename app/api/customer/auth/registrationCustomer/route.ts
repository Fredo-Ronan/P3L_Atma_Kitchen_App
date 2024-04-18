import { connect } from "@/db";
import MailService from "@/services/mail/mailService";
import verifyEmail from "@/templates/verifyEmailTemplates";
import { TableListNames } from "@/constants/tableNames";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { makeToken } from "@/utilities/tokenMaker";

/*
    API ROUTE FOR CUSTOMER REGISTRATION
*/
export async function POST(req: Request){
    const connection = await connect();
    const token = makeToken(20);

    const body = await req.json();
    const username = body.username;
    const password = body.password;
    const nama = body.nama;
    const email = body.email;
    const telepon = body.telepon;
    const tanggalLahir = body.tanggalLahir;

    // Insert Customer Data
    const valueCustomerInsertQuery = [nama, email, tanggalLahir, telepon]; 
    const insertCustomerQuery = `INSERT INTO ${TableListNames.CUSTOMER} (NAMA_CUSTOMER, EMAIL_CUSTOMER, TANGGAL_LAHIR, TELEPON) VALUES (?,?,?,?)`;

    const [resultInsertCustomer, fieldsCustomer] = await connection.execute(insertCustomerQuery, valueCustomerInsertQuery);
    const customerInsertResult = JSON.parse(JSON.stringify(resultInsertCustomer))

    // get the last inserted id_customer value
    const inserted_id_customer = customerInsertResult.insertId;


    // Insert User Data (Username, Password and Temporary Token for email verification)
    const valueUsersInsertQuery = [inserted_id_customer, username, password, token, 0];
    const insertUsersQuery = `INSERT INTO ${TableListNames.USERS} (ID_CUSTOMER, USERNAME, PASSWORD, TOKEN, ACTIVE) VALUES (?,?,?,?,?)`;

    const [resultInsertUser, fieldsUser] = await connection.execute(insertUsersQuery, valueUsersInsertQuery);
    connection.end();

    const insertUserResult = JSON.parse(JSON.stringify(resultInsertUser));

    // Get the recently or last inserted id_user value
    const inserted_id_user = insertUserResult.insertId;

    // Send Email Verification to User with TOKEN and Inserted ID customer
    const verifyTokenLink = process.env.BASE_URL + "/verify/" + token + "/" + inserted_id_user;
    const emailBodyTemplate = verifyEmail(verifyTokenLink);
    const mailService = MailService.getInstance();
    await mailService.createConnection();
    await mailService.sendMail((req.headers as unknown as { [key: string]: string })['X-Request-Id'], {
        to: email,
        subject: "Verify Your Atma Kitchen Account",
        html: emailBodyTemplate.html,
    });
    

    return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: null}));
}