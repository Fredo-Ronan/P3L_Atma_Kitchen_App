import { getDataPoin } from "@/actions/getDataPoin.actions";
import { POIN } from "@/types";
import axios from "axios";


/* 
    Fungsi untuk menghitung poin yang di dapat dari transaksi customer termasuk double poin
*/
function isBirthday(birthdate: Date): boolean {
    const today = new Date();
    const birthdateThisYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
    
    // Calculate the start and end dates for the birthday window
    const startWindow = new Date(birthdateThisYear);
    startWindow.setDate(startWindow.getDate() - 3); // 3 days before birthday
    const endWindow = new Date(birthdateThisYear);
    endWindow.setDate(endWindow.getDate() + 3); // 3 days after birthday
  
    // Check if today's date falls within the birthday window
    return today >= startWindow && today <= endWindow;
}

function isContinue(dataPoin: POIN[], sisaTotalHarga: number){
    for(let i = dataPoin.length - 1; i >= 0; i--){
        if(sisaTotalHarga >= dataPoin.at(i)?.SYARAT!){
            return {jumlahPoin: dataPoin.at(i)?.JUMLAH_POIN, syarat: dataPoin.at(i)?.SYARAT};
        }
    }

    return {jumlahPoin: 0, syarat: -1};
}
  
export async function countPoin(totalHarga: number, tanggalLahirCustomer?: string){
    try {
        const dataPoinFromCookies = await getDataPoin();
        const dataPoin: POIN[] = JSON.parse(dataPoinFromCookies!);

        let totalHargaDecrement = totalHarga;
        let poinResult = 0;
        let pengurang: {jumlahPoin?: number, syarat?: number} = {jumlahPoin: 0, syarat: 0};
        let birthday = false;

        console.log(dataPoin);

        while(pengurang.syarat !== -1){
            pengurang = isContinue(dataPoin, totalHargaDecrement);

            // console.log(pengurang);

            poinResult += pengurang.jumlahPoin!;
            totalHargaDecrement -= pengurang.syarat!;
        }

        // console.log(poinResult);

        if(isBirthday(new Date(tanggalLahirCustomer!))){
            poinResult *= 2;
        }

        // console.log(poinResult);
        return {poin: poinResult, birthday: birthday};
    }catch(error){
        console.log(error);
        throw error;
    }
}