
/*
    CONSTANT FOR STATUS CODES ON API RESPONSES
*/

export const StatusCodesP3L = {
    OK: "OK", // If the response is OK or no error or the credentials is valid
    NOT_OK: "NOT OK", // for any response that indicate not going well include wrong password or else
    NOT_VERIFIED: "NOT VERIFIED", // if the response is intended to be a login of user that not verify the email or else
    FORBIDEN: "FORBIDEN" // if the response is intended to be forbiden or some route not permited because of invalid credentials or else
}