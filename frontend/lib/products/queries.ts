// lib/products/queries.ts
import { getProducts } from "./store";
import { Product } from "./types";
import { toSlug } from "./store";

export function getProductBySlug(slug: string): Product | null {
  const s = slug.toLowerCase();
  return getProducts().find((p) => p.id === s || toSlug(p.name) === s) || null;
}

export function listProductsByCategory(category: Product["category"]) {
  return getProducts().filter((p) => p.category === category);
}

export function listProductsByAuthor(author: string) {
  const a = author.toLowerCase();
  return getProducts().filter((p) => p.author.toLowerCase() === a);
}
