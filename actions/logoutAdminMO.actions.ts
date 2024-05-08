'use server';
import { getSessionAdmin, getSessionMO, getSessionOwner, logoutAdmin, logoutMO, logoutOwner } from "@/lib";

export async function logoutTriggerAdminMO() {
    if(await getSessionAdmin() !== null){
        await logoutAdmin();
    }

    if(await getSessionMO() !== null){
        await logoutMO();
    }

    if(await getSessionOwner() !== null){
        await logoutOwner();
    }
}