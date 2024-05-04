import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";

export async function GET(req: Request, { params }: { params: { params: string } }){
    try {
        const connection = await connect();

        // get all produk
        const getAllProdukQuery = `SELECT ID_PRODUK FROM PRODUK`;
    
        const [resultAllProduk, fieldsProduk] = await connection.execute(getAllProdukQuery);
        connection.end();

        const final_result_all_produk = parseResultQuery(resultAllProduk);
        const arrayOfIdProdukJSON = final_result_all_produk.split(",");
        let arrayOfIdProdukFinal: number[] = [];
        
        arrayOfIdProdukJSON.forEach((element, index) => {
            arrayOfIdProdukFinal.push(
                parseInt(element.split(":")[1].split("}")[0])
            );
        })

        return new Response(JSON.stringify({status: StatusCodesP3L.OK, data: arrayOfIdProdukFinal}));
    }catch(error){
        console.log(error);
        throw error;
    }
}