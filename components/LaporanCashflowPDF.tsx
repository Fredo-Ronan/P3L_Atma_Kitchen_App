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
    width: "33.33%",
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
    width: "33.33%",
    textAlign: "center",
  },
  totalCellValue: {
    width: "33.33%",
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

const LaporanCashflowPDF = ({ data, month }: { data: any; month: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.headerSubtitle}>Atma Kitchen</Text>
        <Text style={styles.headerTitle}>
          Laporan Pemasukan dan Pengeluaran Bulanan {month}
        </Text>
      </View>
      <Text style={styles.smallText}>
        Dicetak pada: {new Date().toISOString().slice(0, 10)}
      </Text>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={[styles.tableCol, styles.tableCell]}></Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Pemasukan</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>Pengeluaran</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, styles.tableCell]}>Penjualan</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>
            Rp. {data.pemasukan}
          </Text>
          <Text style={[styles.tableCol, styles.tableCell]}></Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, styles.tableCell]}>Tip</Text>
          <Text style={[styles.tableCol, styles.tableCell]}>
            Rp. {data.tip}
          </Text>
          <Text style={[styles.tableCol, styles.tableCell]}></Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, styles.tableCell]}>Gaji Karyawan</Text>
          <Text style={[styles.tableCol, styles.tableCell]}></Text>
          <Text style={[styles.tableCol, styles.tableCell]}>
            Rp. {data.gajiKaryawan}
          </Text>
        </View>
        {data?.pengeluaranLain?.map((item: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCol, styles.tableCell]}>
              {item.NAMA_PENGELUARAN}
            </Text>
            <Text style={[styles.tableCol, styles.tableCell]}></Text>
            <Text style={[styles.tableCol, styles.tableCell]}>
              Rp. {item.BIAYA_PENGELUARAN}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={[styles.totalCellLabel, styles.tableCell]}>Total</Text>
          <Text style={[styles.totalCellValue, styles.tableCell]}>
            Rp. {Number(data.pemasukan) + Number(data.tip)}
          </Text>
          <Text style={[styles.totalCellValue, styles.tableCell]}>
            Rp.{" "}
            {data.gajiKaryawan +
              data?.pengeluaranLain?.reduce(
                (acc: number, current: any) =>
                  acc + Number(current.BIAYA_PENGELUARAN),
                0
              )}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default LaporanCashflowPDF;
