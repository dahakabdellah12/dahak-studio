"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ProjectCategory, Platform, ProjectStatus, SortOption } from "@/lib/types";

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProjectCategory | null;
  onCategoryChange: (value: ProjectCategory | null) => void;
  selectedPlatform: Platform | null;
  onPlatformChange: (value: Platform | null) => void;
  selectedStatus: ProjectStatus | null;
  onStatusChange: (value: ProjectStatus | null) => void;
  selectedTech: string | null;
  onTechChange: (value: string | null) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  allTechnologies: string[];
  hasFilters: boolean;
  clearFilters: () => void;
}

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "desktop", label: "سطح مكتب" },
  { value: "mobile", label: "محمول" },
  { value: "game", label: "ألعاب" },
  { value: "open-source", label: "مصادر مفتوحة" },
  { value: "os", label: "أنظمة تشغيل" },
  { value: "library", label: "مكتبات وواجهات" },
  { value: "design", label: "تصميم واجهات" },
  { value: "experiment", label: "تجارب" },
  { value: "article", label: "مقالات وشروحات" },
];

const platforms: { value: Platform; label: string }[] = [
  { value: "windows", label: "ويندوز" },
  { value: "android", label: "أندرويد" },
  { value: "linux", label: "لينكس" },
  { value: "web", label: "ويب" },
  { value: "ios", label: "آيوس" },
  { value: "multi", label: "متعدد المنصات" },
];

const statuses: { value: ProjectStatus; label: string }[] = [
  { value: "released", label: "صادر" },
  { value: "in-development", label: "قيد التطوير" },
  { value: "beta", label: "تجريبي" },
  { value: "archived", label: "مؤرشف" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "الأحدث" },
  { value: "oldest", label: "الأقدم" },
  { value: "popularity", label: "الأكثر شعبية" },
];

export function ProjectFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPlatform,
  onPlatformChange,
  selectedStatus,
  onStatusChange,
  selectedTech,
  onTechChange,
  sortBy,
  onSortChange,
  allTechnologies,
  hasFilters,
  clearFilters,
}: ProjectFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المشاريع..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-9 bg-secondary/50 border-border"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors ${
            showFilters || hasFilters
              ? "border-blue/30 bg-blue/10 text-blue"
              : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          تصفية
          {hasFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue text-[10px] text-white">
              {[selectedCategory, selectedPlatform, selectedStatus, selectedTech].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card space-y-4 rounded-2xl p-5"
        >
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              الفئة
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-blue text-white border-blue"
                      : "hover:border-blue/30 hover:text-blue"
                  }`}
                  onClick={() =>
                    onCategoryChange(selectedCategory === cat.value ? null : cat.value)
                  }
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              المنصة
            </p>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map((plat) => (
                <Badge
                  key={plat.value}
                  variant={selectedPlatform === plat.value ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedPlatform === plat.value
                      ? "bg-blue text-white border-blue"
                      : "hover:border-blue/30 hover:text-blue"
                  }`}
                  onClick={() =>
                    onPlatformChange(selectedPlatform === plat.value ? null : plat.value)
                  }
                >
                  {plat.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              الحالة
            </p>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((status) => (
                <Badge
                  key={status.value}
                  variant={selectedStatus === status.value ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedStatus === status.value
                      ? "bg-blue text-white border-blue"
                      : "hover:border-blue/30 hover:text-blue"
                  }`}
                  onClick={() =>
                    onStatusChange(selectedStatus === status.value ? null : status.value)
                  }
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              التقنية
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {allTechnologies.map((tech) => (
                <Badge
                  key={tech}
                  variant={selectedTech === tech ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedTech === tech
                      ? "bg-blue text-white border-blue"
                      : "hover:border-blue/30 hover:text-blue"
                  }`}
                  onClick={() => onTechChange(selectedTech === tech ? null : tech)}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">ترتيب حسب:</span>
              <div className="flex gap-1.5">
                {sortOptions.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant={sortBy === opt.value ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      sortBy === opt.value
                        ? "bg-blue text-white border-blue"
                        : "hover:border-blue/30 hover:text-blue"
                    }`}
                    onClick={() => onSortChange(opt.value)}
                  >
                    {opt.label}
                  </Badge>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                مسح الكل
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
