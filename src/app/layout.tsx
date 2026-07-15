import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "DAHAK Studio",
    template: "%s | DAHAK Studio",
  },
  description:
    "معرض أعمال ومشاريع تطوير البرمجيات — تطبيقات سطح مكتب، تطبيقات محمولة، ألعاب، مصادر مفتوحة والمزيد.",
  keywords: [
    "مطور برمجيات",
    "تطبيقات سطح المكتب",
    "تطبيقات محمولة",
    "ألعاب",
    "مصادر مفتوحة",
    "برامج",
    "DAHAK",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "DAHAK Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-cairo)]" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
