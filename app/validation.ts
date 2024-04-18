import { z } from "zod";

export const createBahanBakuSchma = z.object({
  nama_bahan: z.string().min(3),
  harga_bahan: z.string().min(1),
  stok_bahan: z.string().min(1),
  satuan: z.string().min(1),
});
