import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyRepublic - Internet Super Cepat & Stabil",
  description: "Nikmati koneksi fiber terbaik tanpa ribet. Konsultasi gratis & pemasangan cepat.",
  keywords: ["MyRepublic", "Internet", "Fiber Optic", "Broadband"],
  icons: {
    icon: "/favicon-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} font-sans antialiased bg-white text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
