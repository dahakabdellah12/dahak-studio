import type { Metadata } from "next";
import { ContactContent } from "./contact-content";

export const metadata: Metadata = {
  title: "تواصل معي — DAHAK Studio | داهك ستوديو",
  description:
    "تواصل مع Dahak Abdellah (داهك عبدالله) عبر GitHub أو البريد الإلكتروني. مطور برمجيات من الجزائر.",
  alternates: {
    canonical: "https://dahak-studio.vercel.app/contact",
  },
  openGraph: {
    title: "تواصل معي — DAHAK Studio",
    description:
      "تواصل مع Dahak Abdellah عبر GitHub أو البريد الإلكتروني.",
    url: "https://dahak-studio.vercel.app/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
