// lib/products/types.ts
export type ProductCategory =
  | "Painting"
  | "Sculpture"
  | "Literature (E-book)"
  | "Graphic Design"
  | "Crafts"
  | "Digital Art";

export type Product = {
  /** ใช้ slug เป็น id เลย เพื่อเชื่อมกับ URL / DB อื่น ๆ */
  id: string;          // เช่น "ocean-whisper"
  name: string;
  author: string;
  price: number;
  rating: number;      // 0..5
  img: string;         // public path
  category: ProductCategory;
};
