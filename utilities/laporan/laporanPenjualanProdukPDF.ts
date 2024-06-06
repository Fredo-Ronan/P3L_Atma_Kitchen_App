import { LAPORAN_PENJUALAN_PER_PRODUK } from '@/types';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function laporanPenjualanProdukPDFMaker(dataLaporan: LAPORAN_PENJUALAN_PER_PRODUK[], bulan: string, total: number){
    const doc = new jsPDF();

    autoTable(doc, { 
        body: [
            [
                {
                    content: 'Atma Kitchen',
                    styles: {
                        halign: "left",
                        fontSize: 18,
                        textColor: "#ffffff"
                    }
                },
                {
                    content: 'Laporan Penjualan Bulanan',
                    styles: {
                        halign: 'right',
                        fontSize: 16,
                        textColor: "#ffffff"
                    }
                }
            ]
        ],
        theme: 'plain',
        styles: {
            fillColor: '#025ca6'
        }
     });

     autoTable(doc, {
        body: [
            [
                {
                    content: `
        Atma Kitchen
        Jl. Centralpark No. 10 Yogyakarta\n
        Bulan : ${bulan}
        Tahun : 2024
        Tanggal Cetak : ${new Date().toLocaleDateString()}
                    `
                }
            ]
        ]
     });


     let items: [[string, string, string, string]] = [["", "", "", ""]];

     dataLaporan.forEach((data) => {
        items.push([data.NAMA_PRODUK, `${data.JUMLAH_TERJUAL.toString()}`, `Rp. ${data.HARGA_PRODUK.toLocaleString("id-ID")}`, `Rp. ${data.JUMLAH_UANG.toLocaleString("id-ID")}`]);
     });

     items.push(["","", "Total", `Rp. ${total.toLocaleString("id-ID")}`]);

     const [, ...finalItems] = items;

     autoTable(doc, {
        head: [['Produk', 'Kuantitas', 'Harga', 'Jumlah Uang']],
        body: finalItems
     });

     doc.save(`Atma_Kitchen_Laporan_Penjualan_Bulan ${bulan}_PerProduk_CETAK_${new Date().toLocaleDateString()}.pdf`);
}