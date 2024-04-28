import { StatusCodesP3L } from "@/constants/statusCodesP3L";
import { connect } from "@/db";
import { parseResultQuery } from "@/utilities/resultQueryParser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const connection = await connect();
    
        const q = req.nextUrl.searchParams.get("q");
        const orderBy = req.nextUrl.searchParams.get("orderBy");
        let page = req.nextUrl.searchParams.get("page") || 1;
        const filter = req.nextUrl.searchParams.get("filter");
    
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
          if (q) {
            query += ` AND JENIS_PRODUK = '${filter}'`;
          } else {
            query += ` WHERE JENIS_PRODUK = '${filter}'`;
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

        const { nama_produk, harga_produk, deskripsi_produk, stok, loyang, status_produk, jenis_produk, gambar_produk } = JSON.parse(
            request.body
        );

        const insertProdukQuery = `INSERT INTO PRODUK (NAMA_PRODUK, HARGA_PRODUK, DESKRIPSI_PRODUK, STOK, LOYANG, STATUS_PRODUK, JENIS_PRODUK, GAMBAR_PRODUK) 
                                    VALUES(?,?,?,?,?,?,?,?)`;

        const [resultInsert, fields] = await connection.execute(insertProdukQuery, [nama_produk, harga_produk, deskripsi_produk, stok, loyang, status_produk, jenis_produk, gambar_produk]);
        connection.end();

        const final_result_insert = parseResultQuery(resultInsert);

        return new Response(JSON.stringify({status: StatusCodesP3L.OK}));
    }catch(error){
        console.log(error);
        throw error;
    }
}