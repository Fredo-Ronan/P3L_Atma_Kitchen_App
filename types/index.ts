export interface BAHAN_BAKU {
  ID_BAHAN: number;
  NAMA_BAHAN: string;
  HARGA_BAHAN: number;
  STOK_BAHAN: number;
  SATUAN: string;
}

export interface PENITIP {
  ID_PENITIP_PRODUK: number
  NAMA_PENITIP: string
  EMAIL_PENITIP: string
  NO_TELP_PENITIP: string
  ALAMAT_PENITIP: string
}




export interface QueryParams {
  q?: string;
  orderBy?: string;
  page?: number;
  filter?: string;
}

