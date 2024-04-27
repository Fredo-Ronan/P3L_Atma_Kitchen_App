'use server';
import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { makeToken } from "@/utilities/tokenMaker";
import { redirect } from "next/navigation";

export const checkEmail = async (formData: any) => {
  const email = formData.email;

  // check is the email is exists on the database or not for changing/reset customer password
  const resCheckEmail = await fetch(
    `${process.env.BASE_URL}/api/customer/auth/checkEmail`,
    {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    }
  );

  const final_response = await resCheckEmail.json();

  // if the email is exists it means the email is valid and go to building token for verification is the user is really want to reset the password or not
  if(final_response.status === StatusCodesP3L.OK){
    const email_customer = final_response.data.EMAIL_CUSTOMER;
    const id_customer = final_response.data.ID_CUSTOMER;
    const token = makeToken(20);

    // update token value on the users table for verification later
    const updateToken = await fetch(`${process.env.BASE_URL}/api/customer/auth/insertResetToken`, {
        method: "POST",
        body: JSON.stringify({
            token: token,
            id_customer: id_customer
        })
    });

    const resultUpdate = await updateToken.json();

    // if the update token operation is OK then send the verification link to user's email
    if(resultUpdate.status === StatusCodesP3L.OK){
        // build verification password reset request link
        const url_reset_password = `${process.env.BASE_URL}/forgot-password/verify/${token}/${id_customer}`;

        // send the request link to user's email
        const resSendEmailReset = await fetch(`${process.env.BASE_URL}/api/customer/auth/sendEmailResetPass`, {
            method: "POST",
            body: JSON.stringify({
                url_reset_password: url_reset_password,
                email: email_customer
            })
        });

        const resultSendEmail = await resSendEmailReset.json();

        if(resultSendEmail.status === StatusCodesP3L.OK){
            redirect(`/forgot-password/emailSend/${email_customer}`);
        }
    }

  }
};
