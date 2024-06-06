import { LAPORAN_STOK_BAHAN } from '@/types'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function laporanStokBahanBakuPDFMaker(dataBahan: LAPORAN_STOK_BAHAN[]){
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
                    content: 'Laporan Stok Bahan Baku',
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
        Tanggal Cetak : ${new Date().toLocaleDateString()}
                    `
                }
            ]
        ]
     });

     let items: [[string, string, string]] = [["", "", ""]];

     dataBahan.forEach((data) => {
        items.push([data.NAMA_BAHAN, data.SATUAN, data.STOK_BAHAN.toString()]);
     })

     const [,...finalItems] = items;

     autoTable(doc, {
        head: [['Nama Bahan', 'Satuan', 'Stok']],
        body: finalItems
     })

     doc.save(`Atma_Kitchen_Laporan_Stok_Bahan_Baku_CETAK_${new Date().toLocaleDateString()}.pdf`);
}