import { link } from "fs";

export interface SideBarAdminProps {
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
