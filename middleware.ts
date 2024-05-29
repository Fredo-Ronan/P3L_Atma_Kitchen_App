import { NextRequest, NextResponse } from "next/server";
import {
  updateSessionAdmin,
  updateSessionCustomer,
  updateSessionMO,
  updateSessionOwner,
} from "./lib";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_NAME,
  CUSTOMER_SESSION_NAME,
  MO_SESSION_NAME,
  OWNER_SESSION_NAME,
} from "./constants";

export async function middleware(request: NextRequest) {
  const sessionAdmin = cookies().get(ADMIN_SESSION_NAME);
  const sessionCustomer = cookies().get(CUSTOMER_SESSION_NAME);
  const sessionMO = cookies().get(MO_SESSION_NAME);
  const sessionOwner = cookies().get(OWNER_SESSION_NAME);

  const currentUrl = new URL(request.url);
  const path = currentUrl.pathname;

  // const authorization = request.headers.get("Authorization");
  // console.log("Authorization => " + authorization);

  // FOR DEBUGGING
  // console.log("Session Admin => " + sessionAdmin);
  // console.log("Session Customer => " + sessionCustomer);

  // if there is a session of a logged in customer, then update that session so it's not expire
  if (sessionCustomer) {
    await updateSessionCustomer(request);
  }

  // if the session MO, ADMIN and Customer is not exists, then redirect to sign-in
  if (
    !sessionMO &&
    !sessionAdmin &&
    !sessionOwner &&
    (path.startsWith("/adminView") ||
      path.startsWith("/moView") ||
      path.startsWith("/ownerView"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // update session expire to MO if the MO is currently logged in
  if (sessionMO) {
    await updateSessionMO(request);
  }

  // update session expire to Admin if the Admin is currently logged in
  if (sessionAdmin) {
    await updateSessionAdmin(request);
  }

  // update session expire to Owner if the Owner is currently logged in
  if (sessionOwner) {
    await updateSessionOwner(request);
  }

  // redirect any user to their role homepage if they have logged in and preventing to go to unauthorize route base on current session name
  if (
    sessionCustomer &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/adminView") ||
      path.startsWith("/moView" || path.startsWith("/ownerView")))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    sessionAdmin &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/moView") ||
      path.startsWith("/ownerView"))
  ) {
    return NextResponse.redirect(new URL("/adminView", request.url));
  }

  if (
    sessionMO &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/adminView") ||
      path.startsWith("/ownerView"))
  ) {
    return NextResponse.redirect(new URL("/moView", request.url));
  }

  if (
    sessionOwner &&
    (path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/adminView") ||
      path.startsWith("/moView"))
  ) {
    return NextResponse.redirect(new URL("/ownerView", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/adminView/:path*",
    "/moView/:path*",
    "/ownerView/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
