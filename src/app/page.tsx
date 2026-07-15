import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Timeline } from "@/components/home/timeline";
import { Skills } from "@/components/home/skills";

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "معرض أعمال ومشاريع تطوير البرمجيات — DAHAK Studio",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedProjects />
      <Skills />
      <Timeline />
    </>
  );
}
