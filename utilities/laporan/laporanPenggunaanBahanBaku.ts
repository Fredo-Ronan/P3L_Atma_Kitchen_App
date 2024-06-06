import { PENGGUNAAN_BAHAN_BAKU } from '@/types';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function laporanPenggunaanBahanPDFMaker(dataLaporan: PENGGUNAAN_BAHAN_BAKU[], bulan: string){
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
                    content: 'Laporan Penggunaan Bahan Baku',
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
        Periode Bulan : ${bulan}
        Tahun : 2024
        Tanggal Cetak : ${new Date().toLocaleDateString()}
                    `
                }
            ]
        ]
     });


     let items: [[string, string, string]] = [["", "", ""]];

     dataLaporan.forEach((data) => {
        items.push([data.NAMA_BAHAN, data.SATUAN,`${data.JUMLAH_DIGUNAKAN.toString()}`]);
     });


     const [, ...finalItems] = items;

     autoTable(doc, {
        head: [['Nama Bahan', 'Satuan', 'Digunakan']],
        body: finalItems
     });

     doc.save(`Atma_Kitchen_Laporan_Penggunaan_Bahan_Baku_Bulan_${bulan}_CETAK_${new Date().toLocaleDateString()}.pdf`);
}