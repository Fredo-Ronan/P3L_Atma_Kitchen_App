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
