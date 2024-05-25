import { HAMPERS_FOR_KERANJANG, PRODUK_FOR_KERANJANG } from '@/types';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function invoiceMaker(nomorTransaksi: string, tanggalPesan: string, tanggalPengiriman: string, namaCustomer: string, alamatPengiriman: string, tipePengiriman: string, items: PRODUK_FOR_KERANJANG[], itemsHampers: HAMPERS_FOR_KERANJANG[], totalHarga: number, poin: number) {
    const doc = new jsPDF();

    autoTable(doc, { 
        body: [
            [
                {
                    content: 'Atma Kitchen',
                    styles: {
                        halign: "left",
                        fontSize: 20,
                        textColor: "#ffffff"
                    }
                },
                {
                    content: 'Order Invoice',
                    styles: {
                        halign: 'right',
                        fontSize: 20,
                        textColor: "#ffffff"
                    }
                }
            ]
        ],
        theme: 'plain',
        styles: {
            fillColor: '#025ca6'
        }
     })

     autoTable(doc, {
        body: [
            [
                {
                    content: `No Transaksi: ${nomorTransaksi}\nTanggal Order: ${tanggalPesan}\nTanggal Pengiriman: ${tanggalPengiriman}\nCustomer: ${namaCustomer}\nTipe Pengiriman: ${tipePengiriman}\n${tipePengiriman === "delivery" ? "Alamat Pengiriman: " + alamatPengiriman : ""}`,
                    styles: {
                        halign: 'left'
                    }
                }
            ]
        ]
     })

     let produkItems: [[string, string]] = [["",""]];

     items.forEach((data) => {
        produkItems.push([data.NAMA_PRODUK, `Rp. ${data.HARGA_PRODUK.toLocaleString("id-ID")}`]);
     })

     itemsHampers.forEach((data) => {
        produkItems.push([data.NAMA_HAMPERS, `Rp. ${data.HARGA_HAMPERS.toLocaleString("id-ID")}`]);
     })

     produkItems.push(["", `Rp ${totalHarga.toLocaleString("id-ID")}`])

     const [, ...finalProdukItems] = produkItems;

    // Or use javascript directly:
    autoTable(doc, {
        head: [['Nama Item', 'Harga Item']],
        body: finalProdukItems,
    })

    autoTable(doc, {
        body: [
            [
                {
                    content: 'Potongan',
                    styles: {
                        halign: 'right'
                    }
                }
            ],
            [
                {
                    content: `Rp. ${poin === 0 ? "-" : (poin * 100).toLocaleString("id-ID")}`,
                    styles: {
                        halign: 'right'
                    }
                }
            ],
            [
                {
                    content: `Total Harus Dibayar`,
                    styles: {
                        halign: 'right',
                        fontSize: 18
                    }
                }
            ],
            [
                {
                    content: `Rp. ${(totalHarga - (poin * 100)).toLocaleString("id-ID")}`,
                    styles: {
                        halign: 'right',
                        fontSize: 20
                    }
                }
            ]
        ]
    })

    doc.save(`Atma_Kitchen_ORDER_NO_${nomorTransaksi}_${namaCustomer}.pdf`)
}