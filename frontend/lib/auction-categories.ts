// lib/auction-categories.ts
export const CATEGORY_LIST = [
  "Painting",
  "Sculpture",
  "Literature (E-book)",
  "Graphic Design",
  "Crafts",
  "Digital Art",
] as const;

export type Category = (typeof CATEGORY_LIST)[number];

export function toCategorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/-+/g, "-");
}

export const categoryToSlug: Record<Category, string> = Object.fromEntries(
  CATEGORY_LIST.map((c) => [c, toCategorySlug(c)])
) as Record<Category, string>;

export const slugToCategory: Record<string, Category> = Object.fromEntries(
  CATEGORY_LIST.map((c) => [toCategorySlug(c), c])
) as Record<string, Category>;
