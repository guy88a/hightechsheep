import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Mulish, Bebas_Neue } from "next/font/google";
import MainLayout from "./_components/layout/MainLayout";
import "./globals.css";
import "./_styles/layout/layout.scss";
import "./_styles/pages/pages.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const firaSans = Manrope({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Hightech Sheep",
  description: "Previous Generation Gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${firaSans.variable}`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}