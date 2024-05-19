import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";
import { EdgeStoreProvider } from "@/lib/edgestore";
import NavbarP3L from "@/components/NavbarP3L";
import { getCustomerDataTrigger } from "@/actions/getCustomerData.actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atma Kitchen",
  description: "Produk Unggulan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getCustomerDataTrigger();
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <EdgeStoreProvider>
        <body className={inter.className}>
          <NavbarP3L userData={userData}/>
          {children}
          <Toaster richColors/>
        </body>
      </EdgeStoreProvider>
    </html>
  );
}
