import { Label } from "@radix-ui/react-label";
import { link } from "fs";

export interface SideBarProps {
  label: string;
  link: string;
}

export const sideBarAdmin = [
  {
    label: "Dashboard",
    link: "/adminView",
  },
  {
    label: "Promo Poin",
    link: "/adminView/promoPoin",
  },
  {
    label: "Produk",
    link: "/adminView/produk",
  },
  {
    label: "Resep",
    link: "/adminView/resep",
  },
  {
    label: "Bahan Baku",
    link: "/adminView/bahanBaku",
  },
  {
    label: "Hampers",
    link: "/adminView/hampers",
  },
  {
    label: "Histori Pesanan",
    link: "/adminView/historiPesananCustomer",
  },
  {
    label: "Pengiriman",
    link: "/adminView/pengiriman",
  },
  {
    label: "Pembayaran",
    link: "/adminView/pembayaran",
  },
];

export const bahanBakuTable = [
  "ID_BAHAN",
  "NAMA_BAHAN",
  "HARGA_BAHAN",
  "STOK_BAHAN",
  "SATUAN",
];

export const satuanFilter = ["kg", "gram", "pcs", "ltr", "ml"];
export const filterProduk = [
  "Titipan",
  "Pre Order",
  "Pre Order + 1 Loyang",
  "Pre Order + 1/2 Loyang",
  "Tersedia",
  "Kosong",
];
export const jenisProduk = ["Titipan", "Pre Order"];
export const jenisMakanan = ["Cake", "Roti", "Minuman"];
export const filterTersedia = ["Tersedia", "Kosong"];
export const filterLoyang = ["1 Loyang", "1/2 Loyang"];

export const sideBarMO = [
  {
    label: "Dashboard",
    link: "/moView",
  },
  {
    label: "Jabatan Karyawan",
    link: "/moView/jabatanKaryawan",
  },
  {
    label: "Karyawan",
    link: "/moView/karyawan",
  },
  {
    label: "Penitip",
    link: "/moView/penitip",
  },
  {
    label: "Pengeluaran Lain",
    link: "/moView/pengeluaranLain",
  },
  {
    label: "Pembelian Bahan Baku",
    link: "/moView/pembelianBahanBaku",
  },
  {
    label: "Konfirmasi Pesanan",
    link: "/moView/konfirmasiPesanan",
  },
];

export const tablePenitip = [
  "ID_PENITIP",
  "NAMA_PENITIP",
  "EMAIL_PENITIP",
  "NO_TELP_PENITIP",
  "ALAMAT_PENITIP",
];

export const tablePengeluaranLain = [
  "ID_PENGELUARAN_LAIN",
  "NAMA_PENGELUARAN",
  "BIAYA_PENGELUARAN",
  "TANGGAL_PENGELUARAN",
];

export const tableHistoriPesananCustomer = [
  "ID_DETIL_TRANSAKSI",
  "NAMA_CUSTOMER",
  "PRODUK",
  "HAMPERS",
  "STATUS_TRANSAKSI",
  "STATUS_PESANAN",
  "TANGGAL_PESANAN",
];

export const tableCustomerHistori = [
  "ID_CUSTOMER",
  "NAMA_CUSTOMER",
  "EMAIL_CUSTOMER",
  "HISTORI_PESANAN",
];

export const tablePesananHistori = [
  "ID_TRANSAKSI_PESANAN",
  "TOTAL_ITEM",
  "TANGGAL_PESANAN",
  "STATUS_TRANSAKSI",
  "STATUS_PESANAN",
  "ALAMAT_PENGIRIMAN",
  "TIPE_PENGIRIMAN",
  "TANGGAL_PENGIRIMAN",
];

export const filterTransaksiPesanan = ["Berhasil", "Gagal", "Pending"];

export const tableDetilTransaksi = [
  "ID_DETIL_TRANSAKSI",
  "NAMA_PRODUK",
  "HAMPERS",
  "JUMLAH_PESANAN",
  "SUBTOTAL",
];

export const sideBarOwner = [
  {
    label: "Dashboard",
    link: "/ownerView",
  },
  {
    label: "Gaji Karyawan",
    link: "/ownerView/gajiKaryawan",
  },
  {
    label: "Bonus Karyawan",
    link: "/ownerView/bonusKaryawan",
  },
];

export const tabelKaryawan = [
  "ID KARYAWAN",
  "NAMA KARYAWAN",
  "EMAIL KARYAWAN",
  "ALAMAT KARYAWAN",
  "NO TELP KARYAWAN",
];

export const tableGajiKaryawan = ["ID ROLE", "ROLE KARYAWAN", "NOMINAL GAJI"];

export const tableBonusKaryawan = [
  "ID BONUS",
  "NAMA KARYAWAN",
  "TANGGAL PEMBERIAN",
  "BONUS",
];

export const resepTable = ["NO", "NAMA RESEP", "DETAIL RESEP"];

export const detailResepTable = [
  "ID DETAIL RESEP",
  "NAMA BAHAN",
  "JUMLAH DIBUTUHKAN",
  "SATUAN",
];

export const customer = [
  "ID CUSTOMER",
  "NAMA CUSTOMER",
  "EMAIL CUSTOMER",
  "TANGGAL LAHIR",
  "TELEPON",
];

export const pengirimanTable = [
  "ID TRANSAKSI",
  "NAMA CUSTOMER",
  "ALAMAT CUSTOMER",
  "JARAK CUSTOMER (meter)",
  "ONGKIR CUSTOMER",
  "TOTAL HARGA",
]

export const pembayaranTable = [
  "ID TRANSAKSI",
  "NAMA CUSTOMER",
  "STATUS TRANSAKSI",
  "TOTAL BAYAR CUSTOMER",
  "JUMLAH TIP",
  "BUKTI TRANSFER",
]