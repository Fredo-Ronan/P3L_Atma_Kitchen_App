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

export const createProdukSchema = z.object({
  nama_produk: z.string().min(1, {
    message: "Nama Produk harus diisi!"
  }),
  harga_produk: z.string().min(1, {
    message: "Harga Produk harus diisi!"
  }),
  deskripsi_produk: z.string().min(1, {
    message: "Deskripsi Produk harus diisi!"
  }),
  stok: z.number().optional(),
  loyang: z.string().min(1, {
    message: "Jumlah loyang harus dipilih!"
  }),
  status_produk: z.string().min(1, {
    message: "Status Produk harus dipilih!"
  }),
  jenis_produk: z.string().min(1, {
    message: "Jenis Produk harus dipilih!"
  })
}).refine(
  (data) => {
    if(data.jenis_produk === "Titipan"){
      return data.stok !== undefined && data.stok > 0;
    }

    return true;
  },
  {
    message: "Stok harus harus diisi jika produk titipan!",
    path: ["stok"],
  }
)
