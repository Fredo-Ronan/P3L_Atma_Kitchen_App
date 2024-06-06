import { PENJUALAN_BULANAN } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function laporanPenjualanKeseluruhanPDFMaker(dataLaporan: PENJUALAN_BULANAN[]) {
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
        Tahun : 2024
        Tanggal Cetak : ${new Date().toLocaleDateString()}
                    `
                }
            ]
        ]
    });

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    let items: Array<[string, string, string]> = [];

    months.forEach((month, index) => {
        const data = dataLaporan.find(d => d.BULAN === index + 1);
        items.push([
            month, 
            data ? `${data.TOTAL_TRANSAKSI.toString()}` : '0', 
            data ? `Rp. ${data.TOTAL_HARGA.toString()}` : 'Rp. 0'
        ]);
    });

    const totalHargaTahunan = dataLaporan.length > 0 ? dataLaporan[0].TOTAL_HARGA_TAHUNAN : 0;
    items.push(["", "Total", `Rp. ${totalHargaTahunan}`]);

    autoTable(doc, {
        head: [['Bulan', 'Jumlah Transaksi', 'Jumlah Uang']],
        body: items
    });

    doc.save(`Atma_Kitchen_Laporan_Penjualan_Bulanan_Keseluruhan_CETAK_${new Date().toLocaleDateString()}.pdf`);
}
