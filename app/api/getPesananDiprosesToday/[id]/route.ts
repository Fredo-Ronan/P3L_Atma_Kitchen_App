import { connect } from "@/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }){
    try {
        const connection = await connect();

        
    }catch(error){
        console.log(error);
        throw error;
    }
}