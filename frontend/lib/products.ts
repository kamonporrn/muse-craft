// lib/products.ts
import { fetchProducts, fetchProductById, searchProducts, fetchProductsByCategory, toFrontendProduct, type ApiProduct } from './api';

export type Product = {
  id?: string; // Product ID from backend (optional for backward compatibility)
  name: string;
  author: string;
  price: number;
  rating?: number;  // 0..5 (optional, removed from collector)
  img: string;     // public path
  category:
    | "Painting" | "Sculpture" | "Literature (E-book)"
    | "Graphic Design" | "Crafts" | "Digital Art";
  status?: "pending" | "approved" | "rejected"; // Product approval status
};

export function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// No fallback products - only use data from API

// Cache for products
let productsCache: Product[] | null = null;
let productsCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all products (with caching)
export async function getProducts(): Promise<Product[]> {
  try {
    // Check cache
    if (productsCache && Date.now() - productsCacheTime < CACHE_DURATION) {
      return productsCache;
    }

    // Fetch from API
    const apiProducts = await fetchProducts();
    productsCache = apiProducts.map(toFrontendProduct);
    productsCacheTime = Date.now();
    return productsCache;
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    return []; // Return empty array instead of fallback
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Try to find in cache first
    if (productsCache) {
      const cached = productsCache.find(p => toSlug(p.name) === slug.toLowerCase());
      if (cached) return cached;
    }

    // Fetch all products and find by slug
    const allProducts = await getProducts();
    return allProducts.find(p => toSlug(p.name) === slug.toLowerCase()) || null;
  } catch (error) {
    console.error('Failed to fetch product by slug:', error);
    return null; // Return null instead of fallback
  }
}

// Search products
export async function searchProductsByQuery(query: string): Promise<Product[]> {
  try {
    const apiProducts = await searchProducts(query);
    return apiProducts.map(toFrontendProduct);
  } catch (error) {
    console.error('Failed to search products:', error);
    return []; // Return empty array instead of fallback
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const apiProducts = await fetchProductsByCategory(category);
    return apiProducts.map(toFrontendProduct);
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    return []; // Return empty array instead of fallback
  }
}

// Export for backward compatibility (synchronous access - uses cache, empty if no cache)
export const products: Product[] = [];
