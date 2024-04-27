'use server';

import { StatusCodesP3L } from "@/constants/statusCodesP3L";

export async function checkUsername(data: any) {
    const username = data.username;

    const resultCheckUsername = await fetch(`${process.env.BASE_URL}/api/admin/resetPassword/checkUsername`, {
        method: "POST",
        body: JSON.stringify({
            username: username
        })
    });

    const final_result_check_username = await resultCheckUsername.json();

    if(final_result_check_username?.status === StatusCodesP3L.OK){
        const id_users = final_result_check_username?.data.id_users;
        return id_users
    }

    return null;
}