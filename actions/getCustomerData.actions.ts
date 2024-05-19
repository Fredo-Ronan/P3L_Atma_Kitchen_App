'use server';
import { getLoggedInUserData } from "@/lib";

export async function getCustomerDataTrigger(){
    const customerData = await getLoggedInUserData();
    
    if(customerData === null){
        return null;
    }

    return customerData;
}