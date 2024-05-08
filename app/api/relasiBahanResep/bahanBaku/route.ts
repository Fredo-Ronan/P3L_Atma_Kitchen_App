import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db";

export async function GET(request: NextRequest) {
    try {
      const connection = await connect();
  
      let query = `SELECT * FROM BAHAN`;
  
      let totalData = 0;
  
      let [rows, fields] = await connection.execute(query);
  
      if (Array.isArray(rows)) {
        totalData = rows.length;
      }
  
      if (totalData === 0) {
        connection.end();
        return NextResponse.json({ data: [], totalData });
      }
  
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
  