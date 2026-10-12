import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
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
      <body className="min-h-full flex flex-col bg-[#f5f6f5] text-[#202a25] font-sans selection:bg-[#dde9e1] selection:text-[#154b3d]">
        {children}
      </body>
    </html>
  );
}
