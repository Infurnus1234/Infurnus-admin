import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const nunito = Inter({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "INFURNUS Admin Portal",
  description: "Administrative & Super Admin management platform for INFURNUS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="admin-root">{children}</body>
    </html>
  );
}
