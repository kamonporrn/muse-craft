// lib/products.ts
export type Product = {
  name: string;
  author: string;
  price: number;
  rating: number;  // 0..5
  img: string;     // public path
  category:
    | "Painting" | "Sculpture" | "Literature (E-book)"
    | "Graphic Design" | "Crafts" | "Digital Art";
};

export function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// 👉 นำ products 36 ชิ้นที่คุณมี “วางไว้ตรงนี้” แทนค่า [] ด้านล่าง
export const products: Product[] = [
  // ... ใส่รายการ 36 ชิ้นของคุณให้ครบ (ชื่อ รูป ราคา ฯลฯ)
// Painting (ภาพวาด)
  { name: "Ocean Whisper",        author: "Clara Everwood",  price: 1499, rating: 5, img: "/img/Painting1.jpg",  category: "Painting" },
  { name: "Twilight Fields",      author: "Adrian Blake",    price: 1799, rating: 4, img: "/img/Painting2.jpg",  category: "Painting" },
  { name: "Golden Horizon",       author: "Maya Thorne",     price: 1599, rating: 5, img: "/img/Painting3.jpg",  category: "Painting" },
  { name: "Silent Harbor",        author: "Leo Hart",        price: 1399, rating: 4, img: "/img/Painting4.jpg",  category: "Painting" },
  { name: "Forest Lullaby",       author: "Nora Vale",       price: 1699, rating: 5, img: "/img/Painting5.jpg",  category: "Painting" },
  { name: "City Nocturne",        author: "Iris Morrow",     price: 1899, rating: 5, img: "/img/painting6.jpg",  category: "Painting" },

  // Sculpture (งานปั้น/แกะสลัก)
  { name: "Marble Grace",         author: "Ari Stone",       price: 3299, rating: 5, img: "/img/sculpture1.jpg", category: "Sculpture" },
  { name: "Cedar Spirit",         author: "Rowan Hale",      price: 2799, rating: 4, img: "/img/sculpture2.jpg", category: "Sculpture" },
  { name: "Bronze Echo",          author: "Kei Aoki",        price: 2999, rating: 5, img: "/img/sculpture3.jpg", category: "Sculpture" },
  { name: "Porcelain Bloom",      author: "Aya Lin",         price: 2599, rating: 4, img: "/img/sculpture4.jpg", category: "Sculpture" },
  { name: "Obsidian Wave",        author: "Dane Rivers",     price: 3499, rating: 5, img: "/img/sculpture5.jpg", category: "Sculpture" },
  { name: "Granite Dawn",         author: "Mila Crest",      price: 2899, rating: 4, img: "/img/sculpture6.jpg", category: "Sculpture" },

  // Literature (E-book) (วรรณกรรม)
  { name: "Mystery Way",          author: "Adrian Blake",    price: 169,  rating: 4, img: "/img/ebook1.jpg",     category: "Literature (E-book)" },
  { name: "Echoes of Rain",       author: "Seren Vale",      price: 149,  rating: 5, img: "/img/ebook2.jpg",     category: "Literature (E-book)" },
  { name: "Paper Stars",          author: "Iman Suri",       price: 129,  rating: 4, img: "/img/ebook3.jpg",     category: "Literature (E-book)" },
  { name: "Shoreline Letters",    author: "Liam North",      price: 159,  rating: 5, img: "/img/ebook4.jpg",     category: "Literature (E-book)" },
  { name: "Glass Garden",         author: "Eden Moss",       price: 139,  rating: 3, img: "/img/ebook5.jpg",     category: "Literature (E-book)" },
  { name: "Midnight Atlas",       author: "Kara Finn",       price: 179,  rating: 5, img: "/img/literature6.jpg",     category: "Literature (E-book)" },

  // Graphic Design (กราฟิกดีไซน์)
  { name: "Neon Poster Set",      author: "Karn Visual",     price: 499,  rating: 5, img: "/img/Graphic Design - 1.jpg",   category: "Graphic Design" },
  { name: "Minimal Brand Kit",    author: "Luca Reed",       price: 699,  rating: 4, img: "/img/Graphic Design - 2.jpg",   category: "Graphic Design" },
  { name: "Retro Cover Pack",     author: "Juno Ray",        price: 399,  rating: 4, img: "/img/Graphic Design - 3.jpg",   category: "Graphic Design" },
  { name: "Monochrome Layouts",   author: "Eli Park",        price: 459,  rating: 5, img: "/img/Graphic Design - 4.jpg",   category: "Graphic Design" },
  { name: "Gradient Toolkit",     author: "Mia Vale",        price: 289,  rating: 4, img: "/img/Graphic Design - 5.jpg",   category: "Graphic Design" },
  { name: "Social Ad Frames",     author: "Noah Grey",       price: 349,  rating: 5, img: "/img/graphicdesign6.jpg",   category: "Graphic Design" },

  // Crafts (หัตถกรรม)
  { name: "Siam Weave",           author: "Aria Moonfall",   price: 1699, rating: 5, img: "/img/craft1.jpg",    category: "Crafts" },
  { name: "Isan Harmony",         author: "Kenneth Bulmer",  price: 899,  rating: 4, img: "/img/craft2.jpg",    category: "Crafts" },
  { name: "Heritage Weaves",      author: "Kael Ashborne",   price: 1899, rating: 5, img: "/img/craft3.png",    category: "Crafts" },
  { name: "Hands of the Loom",    author: "Nyra Solstice",   price: 1299, rating: 4, img: "/img/craft4.jpg",    category: "Crafts" },
  { name: "Bamboo Flow",          author: "Nara Weave",      price: 799,  rating: 4, img: "/img/craft5.jpg",    category: "Crafts" },
  { name: "Golden Knot",          author: "Tida Craft",      price: 1199, rating: 5, img: "/img/craft6.jpg",    category: "Crafts" },

  // Digital Art (ดิจิทัลอาร์ต)
  { name: "The Changeling Worlds",author: "Arwang",          price: 899,  rating: 5, img: "/img/Digital Art - 1.jpg",   category: "Digital Art" },
  { name: "Pixel Aurora",         author: "Kai Vector",      price: 599,  rating: 4, img: "/img/Digital Art - 2.jpg",   category: "Digital Art" },
  { name: "Cyber Petals",         author: "Rin Nova",        price: 649,  rating: 5, img: "/img/Digital Art - 3.jpg",   category: "Digital Art" },
  { name: "Synth Dunes",          author: "Dax Orbit",       price: 549,  rating: 4, img: "/img/Digital Art - 4.jpg",   category: "Digital Art" },
  { name: "Neon Rivers",          author: "Vee Prism",       price: 729,  rating: 5, img: "/img/Digital Art - 5.jpg",   category: "Digital Art" },
  { name: "Glass City",           author: "Nova Lumen",      price: 679,  rating: 4, img: "/img/Digital Art - 6.jpg",   category: "Digital Art" },
];

// สร้าง index จาก slug -> product
const index = new Map(products.map((p) => [toSlug(p.name), p]));

export function getProductBySlug(slug: string) {
  return index.get(slug.toLowerCase()) || null;
}
