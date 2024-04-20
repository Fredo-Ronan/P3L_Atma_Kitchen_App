export interface BAHAN_BAKU {
    ID_BAHAN: number;
    NAMA_BAHAN: string;
    HARGA_BAHAN: number;
    STOK_BAHAN: number;
    SATUAN: string;
}

export interface createBahanBakuParams {
    nama_bahan: string;
    harga_bahan: number;
    stok_bahan: number;
    satuan: string;
    path: string;
}