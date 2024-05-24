import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_NAME, CUSTOMER_SESSION_NAME, MO_SESSION_NAME, OWNER_SESSION_NAME, POIN_DATA } from "./constants";
import { StatusCodesP3L } from "./constants/statusCodesP3L";
import axios from "axios";

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


// LOGIN MECHANISM ============================================================================================================================
export async function login(formData: any) {
    // verify credential and get the user
    const user = {username: formData.username, password: formData.password};

    // make login functionality here
    // TODO
    const loginRes = await fetch(`${process.env.BASE_URL}/api/login`, {
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
    const poinData = await fetch(`${process.env.BASE_URL}/api/poin`, { method: "GET", headers: {
        "Content-Type": "application/json",
    } });

    const resultPoinData = await poinData.json();

    // make conditional if the login is success then execute the code below, if not then just return error response
    if(result?.status === StatusCodesP3L.NOT_OK){
        redirect('/sign-in/failed');
    }

    // make conditional if the user is not active yet or not verify email yet, then go to failed because email not verified
    if(result?.status === StatusCodesP3L.NOT_VERIFIED){
        redirect('/sign-in/notVerified');
    }

    // check what is the role of the user currently logged in
    if(result?.role === "Customer"){
        // the logged in user is a customer
        // create the session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({user, expires});

        // save the session in a cookie
        cookies().set(CUSTOMER_SESSION_NAME, session, {expires, httpOnly: true});
        cookies().set("user_data", JSON.stringify(result.data));
        cookies().set(POIN_DATA, JSON.stringify(resultPoinData.dataPoin));
        redirect("/");
    }

    if(result?.role === "MO"){
        // the logged in user is a Manager Operasional
        // create the session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({user, expires});

        // save the session in a cookie
        cookies().set(MO_SESSION_NAME, session, {expires, httpOnly: true});
        redirect("/moView");
    }

    if(result?.role === "Admin"){
        // the logged in user is an Admin
        // create the session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({user, expires});

        // save the session in a cookie
        cookies().set(ADMIN_SESSION_NAME, session, {expires, httpOnly: true});
        redirect("/adminView");
    }

    if(result?.role === "Owner"){
        // the logged in user is an Admin
        // create the session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const session = await encrypt({user, expires});

        // save the session in a cookie
        cookies().set(OWNER_SESSION_NAME, session, {expires, httpOnly: true});
        redirect("/ownerView");
    }
}



// SESSION MANAGEMENT FOR ADMIN ===============================================================================================================
export async function logoutAdmin(){
    // destroy the session
    cookies().set(ADMIN_SESSION_NAME, "", {expires: new Date(0)});
    redirect("/sign-in");
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


// SESSION MANAGEMENT FOR MANAGER OPERASIONAL ==========================================================================================================
export async function logoutMO(){
    // destroy the session
    cookies().set(MO_SESSION_NAME, "", {expires: new Date(0)});
}

export async function getSessionMO(){
    const session = cookies().get(MO_SESSION_NAME)?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function updateSessionMO(request: NextRequest){
    const session = request.cookies.get(MO_SESSION_NAME)?.value;
    if(!session) return;

    // Refresh the session so it doesn't expire

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: MO_SESSION_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });

    return res;
}

// SESSION MANAGEMENT FOR OWNER ========================================================================================================================
export async function logoutOwner(){
    // destroy the session
    cookies().set(OWNER_SESSION_NAME, "", {expires: new Date(0)});
}

export async function getSessionOwner(){
    const session = cookies().get(OWNER_SESSION_NAME)?.value;
    if(!session) return null;
    return await decrypt(session);
}

export async function updateSessionOwner(request: NextRequest){
    const session = request.cookies.get(OWNER_SESSION_NAME)?.value;
    if(!session) return;

    // Refresh the session so it doesn't expire

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: OWNER_SESSION_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });

    return res;
}


// SESSION MANAGEMENT FOR USERS/CUSTOMER ===============================================================================================================
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