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
];

export const bahanBakuTable = [
  "ID_BAHAN",
  "NAMA_BAHAN",
  "HARGA_BAHAN",
  "STOK_BAHAN",
  "SATUAN",
];

export const satuanFilter = ["kg", "gram", "pcs", "ltr", "ml"];

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
