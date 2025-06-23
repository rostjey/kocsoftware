import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kocsoftware.net",
  description: "Koc Software - Cafe Yönetim Sistemi",
  icons: {
    icon: "https://kocsoftware.net/favicon.ico", // varsayılan favicon
    shortcut: "https://kocsoftware.net/favicon.ico", // Safari uyumluluğu
    apple: "https://kocsoftware.net/apple-touch-icon.png", // iOS ekran kısayolu
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
