'use server';
import { redirect } from 'next/navigation';
import bcrypt from "bcryptjs";
import { StatusCodesP3L } from '@/constants/statusCodesP3L';

const hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export const register = async (formData: any) => {
    const nama = formData.nama;
    const tanggalLahir = formData.tanggalLahir;
    const telepon = formData.telepon;
    const email = formData.email;
    const username = formData.username;
    const password = await hashPassword(formData.password as string);


    const resCheckEmail = await fetch(`${process.env.BASE_URL}/api/customer/auth/checkEmail`, {
        method: "POST",
        body: JSON.stringify({
            email: email
        })
    });

    const isEmailExists = await resCheckEmail.json();

    if(isEmailExists.status === StatusCodesP3L.OK){
        redirect(`/sign-up/failed/${"Email_" + email + "_already_in_use!"}`);
    }


    const res = await fetch(`${process.env.BASE_URL}/api/customer/auth/registrationCustomer`, {
        method: "POST",
        body: JSON.stringify({
            nama: nama,
            tanggalLahir: tanggalLahir,
            telepon: telepon,
            email: email,
            username: username,
            password: password
        })
    });

    if(res.status === 200){
        redirect(`/sign-up/emailSend/${email}`);
    }

    redirect("/");
}