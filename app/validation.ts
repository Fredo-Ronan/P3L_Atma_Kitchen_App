import { z } from "zod";

export const createBahanBakuSchma = z.object({
  nama_bahan: z.string().min(3),
  harga_bahan: z.string().min(1),
  stok_bahan: z.string().min(1),
  satuan: z.string().min(1),
});

export const createPenitipSchema = z.object({
  nama_penitip: z.string().min(3),
  email_penitip: z.string().email(),
  no_telp_penitip: z.string().min(10).max(14),
  alamat_penitip: z.string().min(10),
});

export const createPengeluaranLainSchema = z.object({
  nama_pengeluaran: z.string().min(3),
  biaya_pengeluaran: z.string().min(1),
  tanggal_pengeluaran: z.date(),
});
