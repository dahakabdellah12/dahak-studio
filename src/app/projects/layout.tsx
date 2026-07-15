import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المشاريع",
  description:
    "تصفح جميع المشاريع، تصفّح حسب الفئة أو المنصة أو التقنية.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
