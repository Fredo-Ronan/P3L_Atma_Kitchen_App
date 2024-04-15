import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_NAME, CUSTOMER_SESSION_NAME } from "./constants";
import { StatusCodesP3L } from "./constants/statusCodesP3L";

const secretKey = process.env.SECRET_APP_KEY;
const key = new TextEncoder().encode(secretKey);

// UTILITIES FUNCTIONS ===============================================================================================================
export async function encrypt(payload: any){
    return await new SignJWT(payload).setProtectedHeader({alg: "HS256"}).setIssuedAt().setExpirationTime('2 hours from now').sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const {payload} = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });

    return payload;
}


// SESSION MANAGEMENT FOR ADMIN ===============================================================================================================
export async function loginAdmin(formData: FormData) {
    // verify credential and get the user
    const user = {username: formData.get("username"), password: formData.get("password")};

    // make login functionaliti here
    // TODO
    const loginRes = await fetch(`${process.env.BASE_URL}/api/admin/loginAdmin`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: user.username,
                            password: user.password
                        })
                    });

    const result = await loginRes.json();

    // make conditional if the login is success then execute the code below, if not then just return error response
    if(result?.status === StatusCodesP3L.NOT_OK){
        redirect('/admin/sign-in/failed');
    }

    // create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({user, expires});

    // save the session in a cookie
    cookies().set(ADMIN_SESSION_NAME, session, {expires, httpOnly: true});
    redirect("/admin/home");
}

export async function logoutAdmin(){
    // destroy the session
    cookies().set(ADMIN_SESSION_NAME, "", {expires: new Date(0)});
}

export async function getSessionAdmin(){
    const session = cookies().get(ADMIN_SESSION_NAME)?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function updateSessionAdmin(request: NextRequest){
    const session = request.cookies.get(ADMIN_SESSION_NAME)?.value;
    if(!session) return;

    // Refresh the session so it doesn't expire

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: ADMIN_SESSION_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });

    return res;
}


// SESSION MANAGEMENT FOR USERS/CUSTOMER ===============================================================================================================
export async function loginCustomer(formData: FormData) {
    // verify credential and get the user
    const user = {username: formData.get("username"), password: formData.get("password")};

    // make login functionaliti here
    // TODO
    const loginRes = await fetch(`${process.env.BASE_URL}/api/customer/auth/loginCustomer`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: user.username,
                            password: user.password
                        })
                    });
    
    const result = await loginRes.json();

    // make conditional if the login is success then execute the code below, if not then just return error response
    if(result?.status === StatusCodesP3L.NOT_OK){
        redirect('/sign-in/failed');
    }

    // make conditional if the user is not active yet or not verify email yet, then go to failed because email not verified
    if(result?.status === StatusCodesP3L.NOT_VERIFIED){
        redirect('/sign-in/notVerified');
    }

    // create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({user, expires});

    // save the session in a cookie
    cookies().set(CUSTOMER_SESSION_NAME, session, {expires, httpOnly: true});
    cookies().set("user_data", JSON.stringify(result.data));
    redirect("/");
}

export async function logoutCustomer(){
    // destroy the session
    cookies().set(CUSTOMER_SESSION_NAME, "", {expires: new Date(0)});
    cookies().set("user_data", "");
}
export async function getLoggedInUserData(){
    const user_data = cookies().get("user_data")?.value;
    if(!user_data) return null;
    return user_data;
}

export async function getSessionCustomer(){
    const session = cookies().get(CUSTOMER_SESSION_NAME)?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function updateSessionCustomer(request: NextRequest){
    const session = request.cookies.get(CUSTOMER_SESSION_NAME)?.value;
    if(!session) return;

    // Refresh the session so it doesn't expire

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: CUSTOMER_SESSION_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });

    return res;
}