"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, Divider } from "@tremor/react";
import axios from "axios";
import { PENJUALAN_BULANAN } from "@/types";
import { Loader2 } from "lucide-react";

const allMonths = [
  { month: 1, date: "Jan 24", "This Year": 0 },
  { month: 2, date: "Feb 24", "This Year": 0 },
  { month: 3, date: "Mar 24", "This Year": 0 },
  { month: 4, date: "Apr 24", "This Year": 0 },
  { month: 5, date: "May 24", "This Year": 0 },
  { month: 6, date: "Jun 24", "This Year": 0 },
  { month: 7, date: "Jul 24", "This Year": 0 },
  { month: 8, date: "Aug 24", "This Year": 0 },
  { month: 9, date: "Sep 24", "This Year": 0 },
  { month: 10, date: "Oct 24", "This Year": 0 },
  { month: 11, date: "Nov 24", "This Year": 0 },
  { month: 12, date: "Dec 24", "This Year": 0 },
];

export default function ChartPenjualan() {
  const [penjualan, setPenjualan] = useState<PENJUALAN_BULANAN[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPenjualan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/penjualanBulanan");
      const fetchedData = res.data.data.map((item: PENJUALAN_BULANAN) => ({
        ...item,
        date:
          new Date(2024, item.BULAN - 1).toLocaleString("default", {
            month: "short",
          }) + " 24",
        "This Year": item.TOTAL_HARGA,
      }));

      const mergedData = allMonths.map((month) => {
        const monthData = fetchedData.find(
          (data: PENJUALAN_BULANAN) => data.BULAN === month.month
        );
        return monthData ? monthData : month;
      });

      setPenjualan(mergedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchPenjualan();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );

  const valueFormatter = (number: number) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(number);
  };

  return (
    <>
      <Card className="sm:mx-auto sm:max-w-4xl">
        <h3 className="ml-1 mr-1 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Laporan Penjualan Atma Kitchen
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Penjualan Tahun Ini
        </p>
        <div className="mt-6 hidden sm:block" style={{ height: "500px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={penjualan}
              margin={{ top: 100, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={valueFormatter} />
              <Tooltip formatter={valueFormatter} />
              <Legend />
              <Bar dataKey="This Year" fill="#8884d8">
                <LabelList
                  dataKey="This Year"
                  content={(props) => {
                    if (typeof props.value === "number") {
                      return valueFormatter(props.value);
                    }
                    return "";
                  }}
                  position="top"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 sm:hidden" style={{ height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={penjualan}
              margin={{ top: 100, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={valueFormatter} />
              <Tooltip formatter={valueFormatter} />
              <Legend />
              <Bar dataKey="This Year" fill="#8884d8">
                <LabelList
                  dataKey="This Year"
                  content={(props) => {
                    if (typeof props.value === "number") {
                      return valueFormatter(props.value);
                    }
                    return "";
                  }}
                  position="top"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Divider />
      </Card>
    </>
  );
}
