export type ProductCategory =
  | "Painting"
  | "Sculpture"
  | "Literature (E-book)"
  | "Graphic Design"
  | "Crafts"
  | "Digital Art";

export type ProductStatus = "pending" | "approved" | "rejected";

export interface Product {
  id: string;
  name: string;
  author: string;
  price: number;
  rating?: number; // 0..5 (optional, removed from collector)
  img: string; // public path
  category: ProductCategory;
  description?: string;
  stock?: number;
  status?: ProductStatus; // pending, approved, rejected
  createdAt?: string;
  updatedAt?: string;
}



