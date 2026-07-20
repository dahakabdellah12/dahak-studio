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

const SITE_URL = "https://dahak-studio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DAHAK Studio | داهك ستوديو - معرض مشاريع تطوير البرمجيات",
    template: "%s | DAHAK Studio",
  },
  description:
    "DAHAK Studio (داهك ستوديو) — معرض أعمال Dahak Abdellah لتطوير البرمجيات. تطبيقات سطح مكتب، تطبيقات محمولة، ألعاب، مصادر مفتوحة. بني بالكامل بواسطة الذكاء الاصطناعي.",
  keywords: [
    "dahakstudio",
    "dahak studio",
    "داهك ستوديو",
    "dahak abdellah",
    "dahak abdallah",
    "داهك عبدالله",
    "مطور برمجيات",
    "software developer",
    "تطبيقات سطح المكتب",
    "تطبيقات محمولة",
    "ألعاب",
    "مصادر مفتوحة",
    "open source",
    "معرض أعمال",
    "portfolio",
    "DAHAK",
    "dahak",
  ],
  authors: [{ name: "Dahak Abdellah" }],
  creator: "Dahak Abdellah",
  publisher: "DAHAK Studio",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "DAHAK Studio | داهك ستوديو",
    title: "DAHAK Studio | داهك ستوديو",
    description:
      "DAHAK Studio (داهك ستوديو) — معرض أعمال Dahak Abdellah لتطوير البرمجيات. تطبيقات سطح مكتب، تطبيقات محمولة، ألعاب، مصادر مفتوحة.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "DAHAK Studio | داهك ستوديو",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAHAK Studio | داهك ستوديو",
    description:
      "DAHAK Studio — معرض أعمال تطوير البرمجيات. تطبيقات سطح مكتب، محمولة، ألعاب، مصادر مفتوحة.",
    images: [`${SITE_URL}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dahak Abdellah",
    alternateName: ["داهك عبدالله", "DAHAK", "dahakstudio", "dahak studio"],
    url: SITE_URL,
    jobTitle: "Software Developer",
    description:
      "DAHAK Studio — معرض أعمال ومشاريع تطوير البرمجيات oleh Dahak Abdellah",
    sameAs: [
      "https://github.com/dahakabdellah12",
    ],
    knowsAbout: [
      "Software Development",
      "Desktop Applications",
      "Mobile Applications",
      "Game Development",
      "Open Source",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DAHAK Studio | داهك ستوديو",
    alternateName: ["dahakstudio", "dahak studio", "داهك ستوديو"],
    url: SITE_URL,
    description:
      "DAHAK Studio — معرض أعمال تطوير البرمجيات",
    publisher: {
      "@type": "Person",
      name: "Dahak Abdellah",
    },
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0a0a0f" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-cairo)]" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
