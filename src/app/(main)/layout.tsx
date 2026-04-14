import type { Metadata, Viewport } from "next";

import Header from "@/components/header";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: {
    template: "%s | Hệ Thống Chăm Sóc Thú Cưng Toàn Quốc",
    default: "Spa Thú Cưng | Hệ Thống Chăm Sóc Thú Cưng Toàn Quốc",
  },
  description:
    "Chuỗi hệ thống spa - hotel - shop dành riêng cho thú cưng tại Hồ Chí Minh, Đà Nẵng and more. Dịch vụ thú cưng 24/7 tiêu chuẩn 5 sao",
  keywords: ["spa thú cưng ", "Khách sạn thú cưng", "Thức ăn thú cưng"],
  openGraph: {
    title: {
      template: "%s | Hệ Thống Chăm Sóc Thú Cưng Toàn Quốc",
      default: "Spa Thú Cưng | Hệ Thống Chăm Sóc Thú Cưng Toàn Quốc",
    },
    description:
      "Chuỗi hệ thống spa - hotel - shop dành riêng cho thú cưng tại Hồ Chí Minh, Đà Nẵng and more. Dịch vụ thú cưng 24/7 tiêu chuẩn 5 sao",
    url: `${baseUrl}`,
    siteName: "Hệ Thống Chăm Sóc Thú Cưng Toàn Quốc",
    images: [
      {
        url: "/hoa.jpg",
        width: 1200,
        height: 630,
        alt: "Hệ Thống Chăm Sóc Thú Cưng Toàn Quốc",
      },
    ],
    locale: "vi_VN",
    phoneNumbers: "0813454444",
    type: "website",
    emails: "hello@wannapethouse.com",
    countryName: "Việt Nam",
  },
  alternates: {
    canonical: `${baseUrl}`,
  },
  metadataBase: new URL(`${baseUrl}`),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
