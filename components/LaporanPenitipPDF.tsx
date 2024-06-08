// components/TabelPenitipPDF.js

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
    width: "16.67%",
    textAlign: "center",
    borderRightWidth: 1, // Add border between cells
    borderRightColor: "#bfbfbf", // Add border between cells
    borderRightStyle: "solid", // Add border between cells
    padding: 2, // Add padding to cells
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

const LaporanPenitipPDF = ({ data, month }: { data: any; month: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.headerSubtitle}>
          Laporan Pemasukan dan Pengeluaran Bulanan
        </Text>
        <Text style={styles.headerTitle}>{month}</Text>
      </View>
      <Text style={styles.smallText}>
        Data diperbarui pada {new Date().toISOString().slice(0, 10)}
      </Text>
      <View style={styles.section}>
        {Object.keys(data).map((key, index) => (
          <View key={index}>
            <Text style={{ ...styles.headerSubtitle, marginTop: 20 }}>
              {key}
            </Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>Nama</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>Qty</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>
                Harga Jual
              </Text>
              <Text style={[styles.tableCol, styles.tableCell]}>Total</Text>
              <Text style={[styles.tableCol, styles.tableCell]}>
                20% Komisi
              </Text>
              <Text style={[styles.tableCol, styles.tableCell]}>
                Yang diterima
              </Text>
            </View>
            {data[key].map((item: any, idx: any) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  {item.NAMA_PRODUK}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  {item.QTY}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  Rp. {item.HARGA_PRODUK}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  Rp. {item.TOTAL}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  Rp. {item.KOMISI}
                </Text>
                <Text style={[styles.tableCol, styles.tableCell]}>
                  Rp. {item.PENGHASILAN}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.tableCell]}>Total</Text>
              <View style={{ ...styles.tableCol, width: "66.68%" }}></View>
              <Text style={[styles.tableCol, styles.tableCell]}>
                Rp.{" "}
                {data[key].reduce(
                  (acc: any, item: any) => acc + item.PENGHASILAN,
                  0
                )}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default LaporanPenitipPDF;
