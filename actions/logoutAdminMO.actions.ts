'use server';
import { getSessionAdmin, getSessionMO, logoutAdmin, logoutMO } from "@/lib";

export async function logoutTriggerAdminMO() {
    if(await getSessionAdmin() !== null){
        await logoutAdmin();
    }

    if(await getSessionMO() !== null){
        await logoutMO();
    }
}