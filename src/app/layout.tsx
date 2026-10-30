import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AquaPrice AP | Daily Prawn Rates (East & West Godavari, Krishna)",
  description: "Official daily buying market rates for Vannamei prawn counts in East Godavari, West Godavari, and Krishna districts of Andhra Pradesh. Direct buyer spot rates with instant WhatsApp and phone connectivity.",
  keywords: "prawn prices ap, east godavari prawn rates, west godavari prawn market, bhimavaram aqua rates, krishna district prawn buyer, vannamei rates andhra",
  authors: [{ name: "AquaPrice AP" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#202B28] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
