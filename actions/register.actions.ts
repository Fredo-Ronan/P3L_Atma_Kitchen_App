import { redirect } from 'next/navigation';
import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export const register = async (formData: FormData) => {
    const nama = formData.get("nama");
    const tanggalLahir = formData.get("tanggalLahir");
    const telepon = formData.get("telepon");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = await hashPassword(formData.get("password") as string); 


    const res = await fetch(`${process.env.BASE_URL}/api/customer/registrationCustomer`, {
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