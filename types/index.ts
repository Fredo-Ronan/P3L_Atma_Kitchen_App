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
