import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db";

export async function POST(req: NextRequest) {
    try {
      const connection = await connect();
      const res = await req.json();
  
      const { nama_resep} = JSON.parse(
        res.body
      );
  
      const [rows, fields] = await connection.execute(
        `INSERT INTO RESEP (NAMA_RESEP) VALUES ('${nama_resep}')`
      );
  
      connection.end();
      return NextResponse.json(rows, {
        status: 201,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
}

export async function GET(request: NextRequest) {
    try {
      const connection = await connect();
  
      const q = request.nextUrl.searchParams.get("q");
    //   const orderBy = request.nextUrl.searchParams.get("orderBy");
      let page = request.nextUrl.searchParams.get("page") || 1;
      // const filter = request.nextUrl.searchParams.get("filter");
  
      // console.log(q, orderBy, page);
  
      if (Number(page) <= 0 || isNaN(Number(page))) {
        connection.end();
        return NextResponse.json({ data: [], totalData: 0 });
      }
  
      let query = `SELECT * FROM RESEP`;
  
      if (q) {
        query += ` WHERE NAMA_RESEP LIKE '%${q}%'`;
      }
  
    //   if (orderBy) {
    //     query += ` ORDER BY ${orderBy}`;
    //   }
  
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