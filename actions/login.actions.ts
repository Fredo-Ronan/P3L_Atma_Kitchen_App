'use server';
import { login } from "@/lib";

export async function loginTrigger(formData: any){
    await login(formData);
}