'use server';
import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export async function resetPasswordAdmin(data: any){
    const password = data.password;
    const id_users = data.id_users;

    const hashedPassword = await hashPassword(password as string);

    const resultResetPasswordAdmin = await fetch(`${process.env.BASE_URL}/api/admin/resetPassword/reset`, {
        method: "POST",
        body: JSON.stringify({
            password: hashedPassword,
            id_users: id_users
        })
    });

    const finalResult = await resultResetPasswordAdmin.json();

    if(finalResult?.status === StatusCodesP3L.OK){
        // success
        redirect('/forgot-password/success');
    }
}