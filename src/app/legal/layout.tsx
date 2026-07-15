import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "الشروط والأحكام وحقوق الاستخدام لموقع DAHAK Studio",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
