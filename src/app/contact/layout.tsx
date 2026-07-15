import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معي",
  description:
    "تواصل معي. أسئلة، تعاون، أو فقط قل مرحاً.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
