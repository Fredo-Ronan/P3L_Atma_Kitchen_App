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

export interface PRODUK_FOR_KERANJANG {
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
  TANGGAL_PENGIRIMAN: string;
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

export interface HAMPERS_FOR_KERANJANG {
  ID_HAMPERS: number;
  NAMA_HAMPERS: string;
  HARGA_HAMPERS: number;
  DESKRIPSI_HAMPERS: string;
  TANGGAL_PENGIRIMAN: string;
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

export interface POIN {
  ID_POIN: number;
  NAMA_POIN: string;
  JUMLAH_POIN: number;
  SYARAT: number;
  KETERANGAN_POIN: string;
}

export interface PENGIRIMAN{
  ID_TRANSAKSI_PESANAN: number;
  ID_CUSTOMER: number;
  NAMA_CUSTOMER: string;
  ALAMAT_PENGIRIMAN: string;
  TOTAL_ITEM: number;
  JARAK: number;
  ONGKIR: number;
  TOTAL_HARUS_DIBAYAR: number;
}

export interface PEMBAYARAN{
  ID_TRANSAKSI_PESANAN: number;
  ID_CUSTOMER: number;
  NAMA_CUSTOMER: string;
  STATUS_TRANSAKSI: string;
  TOTAL_HARGA: string;
  TOTAL_BAYAR_CUSTOMER: number;
  JUMLAH_TIP: number;
  BUKTI_TF: string;
}

export interface TRANSAKSI_PESANAN {
  ID_TRANSAKSI_PESANAN: number; // ID_TRANSAKSI_PESANAN
  NO_TRANSAKSI: string; // NO_TRANSAKSI
  ID_CUSTOMER?: number | null; // ID_CUSTOMER
  TANGGAL_PESANAN?: string | null; // TANGGAL_PESANAN
  ALAMAT_PENGIRIMAN?: string | null; // ALAMAT_PENGIRIMAN
  STATUS_PESANAN?: string | null; // STATUS_PESANAN
  TIPE_PENGIRIMAN?: string | null; // TIPE_PENGIRIMAN
  TOTAL_ITEM?: number | null; // TOTAL_ITEM
  STATUS_TRANSAKSI: string; // STATUS_TRANSAKSI
  TANGGAL_PENGIRIMAN?: string | null; // TANGGAL_PENGIRIMAN
  TOTAL_HARGA: number; // TOTAL_HARGA
  TOTAL_HARUS_DIBAYAR: number; // TOTAL_HARUS_DIBAYAR
  TOTAL_BAYAR_CUSTOMER: number; // TOTAL_BAYAR_CUSTOMER
  JARAK: number; // JARAK
  ONGKIR: number; // ONGKIR
  BUKTI_TF?: string | null; // BUKTI_TF
  POIN?: number | null;
}

export interface DETIL_TRANSAKSI {
  ID_DETIL_TRANSAKSI: number;        // Primary key, auto-increment
  ID_TRANSAKSI_PESANAN: number;      // Index
  ID_PRODUK?: number | null;         // Index, nullable
  ID_RESEP?: number | null;
  NAMA_PRODUK?: number | null;
  JUMLAH_PESANAN?: number | null;    // Nullable
  SUBTOTAL?: number | null;          // Nullable
  ID_HAMPERS?: number | null;        // Index, nullable
  ID_CUSTOMER?: number | null;       // Nullable
  KETERANGAN?: string | null;        // Nullable, varchar(255)
}

export interface PESANAN{
  ID_TRANSAKSI_PESANAN: number;
  NAMA_CUSTOMER: string;
  TOTAL_ITEM: number;
  TOTAL_HARGA: number;
  STATUS_PESANAN: string;
  STATUS_TRANSAKSI: string;
  TIPE_PENGIRIMAN: string;
  TANGGAL_PENGIRIMAN: string;
}

export interface KONFIRMASI_PESANAN{
  ID_CUSTOMER: number;
  ID_TRANSAKSI_PESANAN: number;
  NAMA_CUSTOMER: string;
  TOTAL_ITEM: number;
  TOTAL_HARGA: number;
  STATUS_PESANAN: string;
  TIPE_PENGIRIMAN: string;
}

export interface PENJUALAN_BULANAN{
  TANGGAL_PESANAN: string;
  TOTAL_HARGA: string;
  BULAN: number;
  TOTAL_TRANSAKSI: number;
  TOTAL_HARGA_TAHUNAN: number;
}

export interface LAPORAN_PENJUALAN_PER_PRODUK {
  NAMA_PRODUK: string;
  TANGGAL_PESANAN: string;
  JUMLAH_TERJUAL: number;
  HARGA_PRODUK: number;
  JUMLAH_UANG: number;
}