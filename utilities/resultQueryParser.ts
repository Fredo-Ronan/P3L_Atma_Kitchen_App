
/*
    Function to parse the result query to json and easily access the attribute
*/

import { QueryResult } from "mysql2";

export function parseResultQuery(result: QueryResult){
    const parsed_result = JSON.stringify(result).replace('[', ''); // replace [ symbol in result query
    const final_result = parsed_result.replace(']', ''); // replace ] symbol in result query and become final 1 data in JSON only format not inside an Array

    return final_result;
}