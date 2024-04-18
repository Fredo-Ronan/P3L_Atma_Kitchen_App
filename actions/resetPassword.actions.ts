import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";


const hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export async function resetPassword(formData: FormData){
    const newPassword = formData.get("password");
    const id_customer = formData.get("id_customer");

    const hashedNewPassword = await hashPassword(newPassword as string);

    const resUpdatePassword = await fetch(`${process.env.BASE_URL}/api/customer/auth/resetPassword`, {
        method: "POST",
        body: JSON.stringify({
            password: hashedNewPassword,
            id_customer: id_customer
        })
    });

    const resultUpdate = await resUpdatePassword.json();

    if(resultUpdate.status === StatusCodesP3L.OK){
        redirect("/forgot-password/success");
    }
}