import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من أنا",
  description:
    "تعرف أكثر على Dahak Abdellah، مطوّر تطبيقات وألعاب ومواقع.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
