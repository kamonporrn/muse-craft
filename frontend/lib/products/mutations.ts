// lib/products/mutations.ts
import { Product } from "./types";
import { getProducts, setProducts } from "./store";

export function upsertProduct(p: Product) {
  const list = getProducts();
  const idx = list.findIndex((x) => x.id === p.id);
  if (idx >= 0) list[idx] = p;
  else list.push(p);
  setProducts(list);
  return p;
}

export function deleteProduct(id: string) {
  const list = getProducts().filter((p) => p.id !== id);
  setProducts(list);
}
