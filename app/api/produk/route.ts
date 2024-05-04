import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { filterParser } from "@/utilities/filterParser";
import { calculateDays, getNext7Days, getNextNDays } from "@/utilities/nextNdays";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();
    
        const q = req.nextUrl.searchParams.get("q");
        const orderBy = req.nextUrl.searchParams.get("orderBy");
        let page = req.nextUrl.searchParams.get("page") || 1;
        const filter = req.nextUrl.searchParams.get("filter");
        let loyang = null;

        // console.log(filter);
    
        // console.log(q, orderBy, page);
    
        if (Number(page) <= 0 || isNaN(Number(page))) {
          connection.end();
          return NextResponse.json({ data: [], totalData: 0 });
        }
    
        let query = `SELECT * FROM PRODUK`;
    
        if (q) {
          query += ` WHERE NAMA_PRODUK LIKE '%${q}%'`;
        }
    
        if (orderBy) {
          query += ` ORDER BY ${orderBy}`;
        }
    
        if (filter) {
 
          if(filter?.includes("1 Loyang") || filter?.includes("1/2 Loyang")){
            // kalau ada filter ke loyang brarti masuk
            const resultFilters = filterParser(filter);
            // console.log(resultFilters);
            // console.log(q)

            if (q) {
              query += ` AND JENIS_PRODUK = '${resultFilters[0]}' AND LOYANG = '${resultFilters[1]}'`;
            } else {
              query += ` WHERE JENIS_PRODUK = '${resultFilters[0]}' AND LOYANG = '${resultFilters[1]}'`;
            }
          } else if(filter?.includes("Tersedia") || filter?.includes("Kosong")) {
            if(q){
              query += ` AND STATUS_PRODUK = '${filter}'`;
            } else {
              query += ` WHERE STATUS_PRODUK = '${filter}'`;
            }
          } else {
            // kalau ngga ada filter ke loyang brarti normal ke sini
            if (q) {
              query += ` AND JENIS_PRODUK = '${filter}'`;
            } else {
              query += ` WHERE JENIS_PRODUK = '${filter}'`;
            }
          }
        }
    
        const offset = (Number(page) - 1) * 10;
    
        let totalData = 0;
    
        let [rows, fields] = await connection.execute(query);
    
        if (Array.isArray(rows)) {
          totalData = rows.length;
        }
    
        if (totalData === 0) {
          connection.end();
          return NextResponse.json({ data: [], totalData });
        }
    
        query += ` LIMIT 10 OFFSET ${offset}`;
    
        // console.log(query);
    
        [rows, fields] = await connection.execute(query);
    
        connection.end();
    
        return NextResponse.json(
          { data: rows, totalData },
          {
            status: 200,
          }
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
}


export async function POST(req: NextRequest){
    try {
        const connection = await connect();
        const request = await req.json();
        // console.log("WOYYYYYY")
        // console.log(request.body);

        const { nama_produk, harga_produk, jenis_makanan, deskripsi_produk, stok, loyang, status_produk, jenis_produk, gambar_produk } = JSON.parse(
            request.body
        );

        const insertProdukQuery = `INSERT INTO PRODUK (NAMA_PRODUK, HARGA_PRODUK, JENIS_MAKANAN, DESKRIPSI_PRODUK, STOK, LOYANG, STATUS_PRODUK, JENIS_PRODUK, GAMBAR_PRODUK) 
                                    VALUES(?,?,?,?,?,?,?,?,?)`;

        const [resultInsert, fields] = await connection.execute(insertProdukQuery, [nama_produk, harga_produk, jenis_makanan, deskripsi_produk, stok, loyang, status_produk, jenis_produk, gambar_produk]);
        
        const final_result_insert = parseResultQuery(resultInsert);
        const insertID = JSON.parse(final_result_insert).insertId;

        // get tanggal seharusnya di reset kuota hariannya
        const getLastDateQuery = `SELECT * FROM TANGGAL_LAST_KUOTA`;
        const [resultLastDate, fieldsLast] = await connection.execute(getLastDateQuery);

        const final_result_last_date = parseResultQuery(resultLastDate);

        if(final_result_last_date !== ""){
          const lastDateOnDatabase = new Date(JSON.parse(final_result_last_date).LAST_TANGGAL.split("T")[0]);
          const currentDate = new Date();
          const numberOfDaysToReset = calculateDays(currentDate, lastDateOnDatabase);

          const nextNdays = getNextNDays(numberOfDaysToReset);

          // inserting default kuota to KUOTA_HARIAN for the next 7 days
          nextNdays.forEach(async (date, index) => {
            const insertKuotaSeminggu = `INSERT INTO KUOTA_HARIAN (ID_PRODUK, TANGGAL_KUOTA, KUOTA) VALUES (?,?,?)`;
    
            const [resultInsertKuota, fieldsKuota] = await connection.execute(insertKuotaSeminggu, [insertID, date.toISOString().split("T")[0], 20]);

            console.log(resultInsertKuota);
          })
        }



        // inserting the last date inserted date in KUOTA_HARIAN
        // const insertLastDateQuery = `INSERT INTO TANGGAL_LAST_KUOTA (LAST_TANGGAL) VALUES (?)`;
        // const [resultInsertLastDate, fieldsLastDate] = await connection.execute(insertLastDateQuery, next7days[next7days.length - 1].toISOString().split("T")[0])

        // console.log(resultInsertLastDate);

        connection.end();


        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }catch(error){
        console.log(error);
        throw error;
    }
}