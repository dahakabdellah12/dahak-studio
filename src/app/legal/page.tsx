import type { Metadata } from "next";
import { LegalContent } from "./legal-content";

export const metadata: Metadata = {
  title: "الشروط والأحكام — DAHAK Studio | داهك ستوديو",
  description:
    "الشروط والأحكام وسياسة الخصوصية لموقع DAHAK Studio. شروط الاستخدام والمشاريع مفتوحة المصدر.",
  alternates: {
    canonical: "https://dahak-studio.vercel.app/legal",
  },
};

export default function LegalPage() {
  return <LegalContent />;
}
