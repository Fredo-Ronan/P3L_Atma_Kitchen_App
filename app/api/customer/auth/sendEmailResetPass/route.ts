import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import MailService from "@/services/mail/mailService";
import resetPasswordRequest from "@/templates/resetPasswordTemplate";

export async function POST(req: Request){
    const body = await req.json();

    const reset_pass_verification_link = body.url_reset_password;
    const email = body.email;

    const verifyTokenLink = reset_pass_verification_link;
    const emailBodyTemplate = resetPasswordRequest(verifyTokenLink);
    const mailService = MailService.getInstance();
    await mailService.createConnection();
    await mailService.sendMail((req.headers as unknown as { [key: string]: string })['X-Request-Id'], {
        to: email,
        subject: "Password Reset Request Atma Kitchen Account",
        html: emailBodyTemplate.html,
    });

    return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
}