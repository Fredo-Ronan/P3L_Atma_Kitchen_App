import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atma Kitchen",
  description: "Produk Unggulan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <EdgeStoreProvider>
        <body className={inter.className}>
          {children}
          <Toaster richColors/>
        </body>
      </EdgeStoreProvider>
    </html>
  );
}
