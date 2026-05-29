import type { JobOffer } from "../types";

export const JOB_CATEGORIES = [
  "Tous",
  "Restauration",
  "Énergie Solaire",
  "Tourisme",
  "Nettoyage",
  "Administration",
] as const;

export const SPANISH_LEVELS = [
  "Tous",
  "Aucun",
  "Débutant (A1-A2)",
  "Intermédiaire (B1-B2)",
  "Avancé (C1-C2+)",
] as const;

export type JobCategoryFilter = (typeof JOB_CATEGORIES)[number];
export type SpanishLevelFilter = (typeof SPANISH_LEVELS)[number];

export interface JobFilterState {
  searchQuery: string;
  category: JobCategoryFilter;
  spanishLevel: SpanishLevelFilter;
}

export function filterJobs(jobs: JobOffer[], filters: JobFilterState): JobOffer[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesKeyword =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.requirements.some((r) => r.toLowerCase().includes(query));

    const matchesCategory =
      filters.category === "Tous" || job.category === filters.category;

    const matchesSpanLevel =
      filters.spanishLevel === "Tous" || job.spanishLevel === filters.spanishLevel;

    return matchesKeyword && matchesCategory && matchesSpanLevel;
  });
}
