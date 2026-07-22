import type { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "من أنا — Dahak Abdellah | داهك عبدالله",
  description:
    "تعرف على Dahak Abdellah (داهك عبدالله)، مطور برمجيات من الجزائر متخصص في تطبيقات سطح المكتب، التطبيقات المحمولة، الألعاب، والمصادر المفتوحة.",
  alternates: {
    canonical: "https://dahak-studio.vercel.app/about",
  },
  openGraph: {
    title: "Dahak Abdellah — مطور برمجيات | DAHAK Studio",
    description:
      "مطور برمجيات من الجزائر. متخصص في تطبيقات سطح المكتب، التطبيقات المحمولة، الألعاب، والمصادر المفتوحة.",
    url: "https://dahak-studio.vercel.app/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
