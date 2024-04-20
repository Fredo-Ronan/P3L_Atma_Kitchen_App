import { createBahanBakuParams } from "@/types";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function createBahanBaku(params: createBahanBakuParams) {
  try {
    const { nama_bahan, harga_bahan, stok_bahan, satuan, path } = params;

    console.log(params);

    const response = await axios.post("/api/bahanBaku", 
  
      {
        nama_bahan: nama_bahan,
        harga_bahan: harga_bahan,
        stok_bahan: stok_bahan,
        satuan: satuan,
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to create bahan baku");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
