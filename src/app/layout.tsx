import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header"; 
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Bạn có thể sửa title ở đây cho đúng tên dự án
  title: "Wannapet House", 
  description: "Dự án Wannapet House",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* 2. Đặt thanh Header ở đây để nó luôn nằm trên cùng */}
        <Header />

        {/* Bọc children trong thẻ main và cho flex-1 để nó chiếm phần không gian còn lại */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        
      </body>
    </html>
  );
}