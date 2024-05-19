'use server';
import { logoutCustomer } from "@/lib";
import { redirect } from "next/navigation";

export async function logoutTrigger(){
    await logoutCustomer();
    redirect("/");
}