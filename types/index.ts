export interface BAHAN_BAKU {
  ID_BAHAN: number;
  NAMA_BAHAN: string;
  HARGA_BAHAN: number;
  STOK_BAHAN: number;
  SATUAN: string;
}

export interface PENITIP {
  ID_PENITIP_PRODUK: number;
  NAMA_PENITIP: string;
  EMAIL_PENITIP: string;
  NO_TELP_PENITIP: string;
  ALAMAT_PENITIP: string;
}

export interface PENGELUARAN_LAIN {
  ID_PENGELUARAN_LAIN: number;
  NAMA_PENGELUARAN: string;
  BIAYA_PENGELUARAN: string;
  TANGGAL_PENGELUARAN: Date;
}

export interface PENGADAAN_BAHAN {
  ID_PENGADAAN_BAHAN: number;
  ID_BAHAN: number;
  NAMA_BAHAN: string;
  HARGA_BELI_BAHAN: number;
  TANGGAL_BELI: string;
  JUMLAH_BELI: number;
}

export interface QueryParams {
  q?: string;
  orderBy?: string;
  page?: number;
  filter?: string;
}

export interface CustomerHistori {
  ID_CUSTOMER: number;
  NAMA_CUSTOMER: string;
  EMAIL_CUSTOMER: string;
}

export interface PesananHistori {
  ID_TRANSAKSI_PESANAN: number;
  TOTAL_ITEM: number;
  TANGGAL_PESANAN: Date;
  STATUS_TRANSAKSI: string;
  STATUS_PESANAN: string;
  ALAMAT_PENGIRIMAN: string;
  TIPE_PENGIRIMAN: string;
  TANGGAL_PENGIRIMAN: Date;
}

export interface DetilTransaksiHistori {
  ID_DETIL_TRANSAKSI: number;
  NAMA_PRODUK: string;
  HAMPERS: string;
  JUMLAH_PESANAN: number;
  SUBTOTAL: number;
}

export interface PRODUK {
  ID_PRODUK: number;
  NAMA_PRODUK: string;
  HARGA_PRODUK: number;
  JENIS_MAKANAN: string;
  DESKRIPSI_PRODUK: string;
  STOK: number;
  LOYANG: string;
  STATUS_PRODUK: string;
  JENIS_PRODUK: string;
  GAMBAR_PRODUK: string;
}

export interface PRODUK_FOR_CUSTOMER_UI {
  ID_PRODUK: number;
  NAMA_PRODUK: string;
  HARGA_PRODUK: number[];
  JENIS_MAKANAN: string;
  DESKRIPSI_PRODUK: string;
  STOK: number;
  LOYANG: string[];
  STATUS_PRODUK: string;
  JENIS_PRODUK: string;
  GAMBAR_PRODUK: string;
}

export interface KUOTA_HARIAN {
  ID_KUOTA_HARIAN: number;
  ID_PRODUK: number;
  TANGGAL_KUOTA: string;
  KUOTA: number;
  KETERANGAN: string;
}

export interface HAMPERS {
  ID_HAMPERS: number;
  NAMA_HAMPERS: string;
  HARGA_HAMPERS: number;
  DESKRIPSI_HAMPERS: string;
}


export interface KARYAWAN {
  ID_KARYAWAN: number;
  ID_ROLE: number;
  NAMA_KARYAWAN: string;
  EMAIL_KARYAWAN: string;
  ALAMAT_KARYAWAN: string;
  NO_TELP_KARYAWAN: string;
}

export interface GAJI_KARYAWAN {
  ID_ROLE: number;
  NAMA_ROLE: string;
  NOMINAL_GAJI: string;
}

export interface BONUS_KARYAWAN{
  ID_BONUS: number;
  ID_KARYAWAN: number;
  NAMA_KARYAWAN: string;
  TANGGAL_PEMBERIAN: string;
  BONUS: number;
}

export interface ROLE {
  ID_ROLE: number,
  NAMA_ROLE: string,
}

export interface RESEP{
  ID_RESEP: number;
  NAMA_RESEP: string;
  DETAIL_RESEP: string;
}

export interface DETAIL_RESEP{
  ID_RELASI_BAHAN_RESEP: number;
  ID_BAHAN: number;
  ID_RESEP: number;
  NAMA_BAHAN: string;
  JUMLAH_DIBUTUHKAN: number;
  STOK_TERSEDIA: number;
  SATUAN: string;
}

export interface CUSTOMER{
  ID_CUSTOMER: number;
  NAMA_CUSTOMER: string;
  EMAIL_CUSTOMER: string;
  TANGGAL_LAHIR: string;
  TELEPON: string;
}