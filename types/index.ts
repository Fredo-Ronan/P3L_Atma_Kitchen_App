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
