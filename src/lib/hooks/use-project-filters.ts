import { useState, useMemo } from "react";
import type { Project, ProjectCategory, Platform, ProjectStatus, SortOption } from "@/lib/types";

export interface ProjectFilterState {
  search: string;
  selectedCategory: ProjectCategory | null;
  selectedPlatform: Platform | null;
  selectedStatus: ProjectStatus | null;
  selectedTech: string | null;
  sortBy: SortOption;
}

export function useProjectFilters(projects: Project[]) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPlatform) {
      result = result.filter((p) => p.platforms.includes(selectedPlatform));
    }

    if (selectedStatus) {
      result = result.filter((p) => p.status === selectedStatus);
    }

    if (selectedTech) {
      result = result.filter((p) => p.technologies.includes(selectedTech));
    }

    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.lastUpdated ?? 0).getTime() -
            new Date(a.lastUpdated ?? 0).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.lastUpdated ?? 0).getTime() -
            new Date(b.lastUpdated ?? 0).getTime()
        );
        break;
      case "popularity":
        result.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
        break;
    }

    return result;
  }, [projects, search, selectedCategory, selectedPlatform, selectedStatus, selectedTech, sortBy]);

  const hasFilters = !!(selectedCategory || selectedPlatform || selectedStatus || selectedTech);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedPlatform(null);
    setSelectedStatus(null);
    setSelectedTech(null);
    setSortBy("newest");
  };

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    selectedStatus,
    setSelectedStatus,
    selectedTech,
    setSelectedTech,
    sortBy,
    setSortBy,
    allTechnologies,
    filteredProjects,
    hasFilters,
    clearFilters,
  };
}
