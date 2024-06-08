// components/TabelLaporanPDF.js

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
    alignItems: "center",
    height: 24,
  },
  tableCol: {
    width: "20%",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 10,
  },
  header: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  totalCellLabel: {
    width: "80%", // Adjusted to span over 5 columns
    textAlign: "right",
    paddingRight: 10,
  },
  totalCellValue: {
    width: "20%",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "semibold",
  },
  smallText: {
    fontSize: 8,
    marginTop: 10,
  },
});

const TabelLaporanPDF = ({ data, month }: { data: any; month: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.headerSubtitle}>Atma Kitchen</Text>
        <Text style={styles.headerTitle}>
          Laporan Presensi dan Gaji Karyawan {month}
        </Text>
      </View>
      <Text style={styles.smallText}>
        Dicetak pada: {new Date().toISOString().slice(0, 10)}
      </Text>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={[styles.tableCol, styles.tableCell]}>Nama Karyawan</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Jumlah Hadir</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Jumlah Bolos</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Honor Harian</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Bonus Rajin</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Total</Text>
        </View>
        {data.map((item: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {item.namaKaryawan}
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {item.jumlahHadir}
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {item.jumlahBolos}
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Rp. {item.honorHarian}
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Rp. {item.bonusRajin}
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Rp. {item.totalGaji}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={[styles.totalCellLabel, styles.tableCell]}>Total</Text>
          <Text style={[styles.totalCellValue, styles.tableCell]}>
            Rp.{" "}
            {data.reduce((acc: number, curr: any) => acc + curr.totalGaji, 0)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default TabelLaporanPDF;
