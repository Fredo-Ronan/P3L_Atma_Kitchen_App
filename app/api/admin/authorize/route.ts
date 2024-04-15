import { SignJWT } from "jose";
import { StatusCodesP3L } from "@/constants/statusCodesP3L";

const key = new TextEncoder().encode(process.env.SECRET_APP_KEY);
const passKey = process.env.SECRET_PASS_KEY_API;

export async function POST(req: Request){
    const body = await req.json();
    const reqPassKey = body.passKey;
    const reqUser = body.user;

    console.log(reqPassKey);
    console.log(passKey);

    if(reqPassKey === passKey){
        const token = await new SignJWT({"user": reqUser}).setProtectedHeader({alg: "HS256"}).setIssuedAt().setExpirationTime('2 hours from now').sign(key);
    
        return new Response(JSON.stringify({
            token: token
        }));
    }

    return new Response(JSON.stringify({status: StatusCodesP3L.FORBIDEN, token: null}));
}