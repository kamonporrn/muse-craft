// lib/products/store.ts
import { Product } from "./types";
import { safeGet, safeSet } from "@/lib/users/store"; // ใช้ util เดิมร่วมกัน

export const PRODUCTS_KEY = "musecraft.products";

/** util ทำ slug เหมือนเดิม */
export function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** 
 * SEED_PRODUCTS:
 * - author = Creator display name (ต้องแมปกับ User.name ของ role "Creator")
 */
export const SEED_PRODUCTS: Product[] = [
  // Painting
  {
    id: toSlug("Ocean Whisper"),
    name: "Ocean Whisper",
    author: "Clara Everwood",
    price: 1499,
    rating: 5,
    img: "/img/Painting1.jpg",
    category: "Painting",
  },
  {
    id: toSlug("Twilight Fields"),
    name: "Twilight Fields",
    author: "Adrian Blake",
    price: 1799,
    rating: 4,
    img: "/img/Painting2.jpg",
    category: "Painting",
  },
  {
    id: toSlug("Golden Horizon"),
    name: "Golden Horizon",
    author: "Maya Thorne",
    price: 1599,
    rating: 5,
    img: "/img/Painting3.jpg",
    category: "Painting",
  },
  {
    id: toSlug("Silent Harbor"),
    name: "Silent Harbor",
    author: "Leo Hart",
    price: 1399,
    rating: 4,
    img: "/img/Painting4.jpg",
    category: "Painting",
  },
  {
    id: toSlug("Forest Lullaby"),
    name: "Forest Lullaby",
    author: "Nora Vale",
    price: 1699,
    rating: 5,
    img: "/img/Painting5.jpg",
    category: "Painting",
  },
  {
    id: toSlug("City Nocturne"),
    name: "City Nocturne",
    author: "Iris Morrow",
    price: 1899,
    rating: 5,
    img: "/img/Painting6.jpg",
    category: "Painting",
  },

  // Sculpture
  {
    id: toSlug("Marble Grace"),
    name: "Marble Grace",
    author: "Ari Stone",
    price: 3299,
    rating: 5,
    img: "/img/sculpture1.jpg",
    category: "Sculpture",
  },
  {
    id: toSlug("Cedar Spirit"),
    name: "Cedar Spirit",
    author: "Rowan Hale",
    price: 2799,
    rating: 4,
    img: "/img/sculpture2.jpg",
    category: "Sculpture",
  },
  {
    id: toSlug("Bronze Echo"),
    name: "Bronze Echo",
    author: "Kei Aoki",
    price: 2999,
    rating: 5,
    img: "/img/sculpture3.jpg",
    category: "Sculpture",
  },
  {
    id: toSlug("Porcelain Bloom"),
    name: "Porcelain Bloom",
    author: "Aya Lin",
    price: 2599,
    rating: 4,
    img: "/img/sculpture4.jpg",
    category: "Sculpture",
  },
  {
    id: toSlug("Obsidian Wave"),
    name: "Obsidian Wave",
    author: "Dane Rivers",
    price: 3499,
    rating: 5,
    img: "/img/sculpture5.jpg",
    category: "Sculpture",
  },
  {
    id: toSlug("Granite Dawn"),
    name: "Granite Dawn",
    author: "Mila Crest",
    price: 2899,
    rating: 4,
    img: "/img/sculpture6.jpg",
    category: "Sculpture",
  },

  // Literature (E-book)
  {
    id: toSlug("Mystery Way"),
    name: "Mystery Way",
    author: "Adrian Blake",
    price: 169,
    rating: 4,
    img: "/img/ebook1.jpg",
    category: "Literature (E-book)",
  },
  {
    id: toSlug("Echoes of Rain"),
    name: "Echoes of Rain",
    author: "Seren Vale",
    price: 149,
    rating: 5,
    img: "/img/ebook2.jpg",
    category: "Literature (E-book)",
  },
  {
    id: toSlug("Paper Stars"),
    name: "Paper Stars",
    author: "Iman Suri",
    price: 129,
    rating: 4,
    img: "/img/ebook3.jpg",
    category: "Literature (E-book)",
  },
  {
    id: toSlug("Shoreline Letters"),
    name: "Shoreline Letters",
    author: "Liam North",
    price: 159,
    rating: 5,
    img: "/img/ebook4.jpg",
    category: "Literature (E-book)",
  },
  {
    id: toSlug("Glass Garden"),
    name: "Glass Garden",
    author: "Eden Moss",
    price: 139,
    rating: 3,
    img: "/img/ebook5.jpg",
    category: "Literature (E-book)",
  },
  {
    id: toSlug("Midnight Atlas"),
    name: "Midnight Atlas",
    author: "Kara Finn",
    price: 179,
    rating: 5,
    img: "/img/ebook6.jpg",
    category: "Literature (E-book)",
  },

  // Graphic Design
  {
    id: toSlug("Neon Poster Set"),
    name: "Neon Poster Set",
    author: "Karn Visual",
    price: 499,
    rating: 5,
    img: "/img/Graphic1.jpg",
    category: "Graphic Design",
  },
  {
    id: toSlug("Minimal Brand Kit"),
    name: "Minimal Brand Kit",
    author: "Luca Reed",
    price: 699,
    rating: 4,
    img: "/img/Graphic2.jpg",
    category: "Graphic Design",
  },
  {
    id: toSlug("Retro Cover Pack"),
    name: "Retro Cover Pack",
    author: "Juno Ray",
    price: 399,
    rating: 4,
    img: "/img/Graphic3.jpg",
    category: "Graphic Design",
  },
  {
    id: toSlug("Monochrome Layouts"),
    name: "Monochrome Layouts",
    author: "Eli Park",
    price: 459,
    rating: 5,
    img: "/img/Graphic4.jpg",
    category: "Graphic Design",
  },
  {
    id: toSlug("Gradient Toolkit"),
    name: "Gradient Toolkit",
    author: "Mia Vale",
    price: 289,
    rating: 4,
    img: "/img/Graphic5.jpg",
    category: "Graphic Design",
  },
  {
    id: toSlug("Social Ad Frames"),
    name: "Social Ad Frames",
    author: "Noah Grey",
    price: 349,
    rating: 5,
    img: "/img/Graphic6.jpg",
    category: "Graphic Design",
  },

  // Crafts
  {
    id: toSlug("Siam Weave"),
    name: "Siam Weave",
    author: "Aria Moonfall",
    price: 1699,
    rating: 5,
    img: "/img/Painting1.jpg", // Using placeholder until crafts images are added
    category: "Crafts",
  },
  {
    id: toSlug("Isan Harmony"),
    name: "Isan Harmony",
    author: "Kenneth Bulmer",
    price: 899,
    rating: 4,
    img: "/img/Painting2.jpg", // Using placeholder until crafts images are added
    category: "Crafts",
  },
  {
    id: toSlug("Heritage Weaves"),
    name: "Heritage Weaves",
    author: "Kael Ashborne",
    price: 1899,
    rating: 5,
    img: "/img/Painting3.jpg", // Using placeholder until crafts images are added
    category: "Crafts",
  },
  {
    id: toSlug("Hands of the Loom"),
    name: "Hands of the Loom",
    author: "Nyra Solstice",
    price: 1299,
    rating: 4,
    img: "/img/Painting4.jpg", // Using placeholder until crafts images are added
    category: "Crafts",
  },
  {
    id: toSlug("Bamboo Flow"),
    name: "Bamboo Flow",
    author: "Nara Weave",
    price: 799,
    rating: 4,
    img: "/img/Painting5.jpg", // Using placeholder until crafts images are added
    category: "Crafts",
  },
  {
    id: toSlug("Golden Knot"),
    name: "Golden Knot",
    author: "Tida Craft",
    price: 1199,
    rating: 5,
    img: "/img/Painting6.jpg", // Using placeholder until crafts images are added
    category: "Crafts",
  },

  // Digital Art
  {
    id: toSlug("The Changeling Worlds"),
    name: "The Changeling Worlds",
    author: "Arwang",
    price: 899,
    rating: 5,
    img: "/img/Digital1.jpg",
    category: "Digital Art",
  },
  {
    id: toSlug("Pixel Aurora"),
    name: "Pixel Aurora",
    author: "Kai Vector",
    price: 599,
    rating: 4,
    img: "/img/Digital2.jpg",
    category: "Digital Art",
  },
  {
    id: toSlug("Cyber Petals"),
    name: "Cyber Petals",
    author: "Rin Nova",
    price: 649,
    rating: 5,
    img: "/img/Digital3.jpg",
    category: "Digital Art",
  },
  {
    id: toSlug("Synth Dunes"),
    name: "Synth Dunes",
    author: "Dax Orbit",
    price: 549,
    rating: 4,
    img: "/img/Digital4.jpg",
    category: "Digital Art",
  },
  {
    id: toSlug("Neon Rivers"),
    name: "Neon Rivers",
    author: "Vee Prism",
    price: 729,
    rating: 5,
    img: "/img/Digital5.jpg",
    category: "Digital Art",
  },
  {
    id: toSlug("Glass City"),
    name: "Glass City",
    author: "Nova Lumen",
    price: 679,
    rating: 4,
    img: "/img/digital6.jpg",
    category: "Digital Art",
  },
];

export function getProducts(): Product[] {
  return safeGet<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS);
}

export function setProducts(list: Product[]) {
  safeSet<Product[]>(PRODUCTS_KEY, list);
}
