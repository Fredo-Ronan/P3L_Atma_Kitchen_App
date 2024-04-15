import { NextRequest, NextResponse } from "next/server";
import { updateSessionAdmin, updateSessionCustomer } from "./lib";
import { cookies } from "next/headers";
import { ADMIN_SESSION_NAME, CUSTOMER_SESSION_NAME } from "./constants";

export async function middleware(request: NextRequest){

    const sessionAdmin = cookies().get(ADMIN_SESSION_NAME);
    const sessionCustomer = cookies().get(CUSTOMER_SESSION_NAME);

    const authorization = request.headers.get("Authorization");
    console.log("Authorization => " + authorization);

    // FOR DEBUGGING
    // console.log("Session Admin => " + sessionAdmin);
    // console.log("Session Customer => " + sessionCustomer);
    
    // if there is a session of a logged in customer, then update that session so it's not expire
    if(sessionCustomer){
        await updateSessionCustomer(request);
    }

    // if there is no session of e logged in admin/employee, then redirect to the home page as any logged out user can visit
    // and skip the update for this admin session
    if(!sessionAdmin){
        return NextResponse.redirect(
            new URL('/admin/sign-in', request.url)
        )
    }

    // redirect user to go to the admin sign in page if the URL route is /admin
    if(request.url === '/admin' && !sessionAdmin){
        return NextResponse.redirect(
            new URL('/admin/sign-in')
        )
    }

    // this will be skipped if there is no admin logged in
    await updateSessionAdmin(request);

    return NextResponse.next(); 
}

export const config = {
    matcher: ['/admin/home/:path*', '/admin']
}