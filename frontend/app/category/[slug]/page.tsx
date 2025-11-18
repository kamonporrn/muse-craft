"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getProductsByCategory, toSlug, type Product as LibProduct } from "@/lib/products";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { isSignedIn } from "@/lib/auth";

// category -> badge classes (Tailwind)
const categoryBadge: Record<string, string> = {
  "Painting": "bg-blue-100 text-blue-800",
  "Sculpture": "bg-amber-100 text-amber-800",
  "Literature (E-book)": "bg-green-100 text-green-800",
  "Graphic Design": "bg-pink-100 text-pink-800",
  "Crafts": "bg-yellow-100 text-yellow-800",
  "Digital Art": "bg-purple-100 text-purple-800",
};

// slug ↔ category mapping
const slugToCategory: Record<string, string> = {
  "painting": "Painting",
  "sculpture": "Sculpture",
  "literature": "Literature (E-book)",
  "graphic-design": "Graphic Design",
  "crafts": "Crafts",
  "digital-art": "Digital Art",
};
const categoryToSlug = Object.fromEntries(
  Object.entries(slugToCategory).map(([k, v]) => [v, k])
);

const categories = [
  "Painting",
  "Sculpture",
  "Literature (E-book)",
  "Graphic Design",
  "Crafts",
  "Digital Art",
] as const;
type Category = (typeof categories)[number];

type Product = {
  name: string;
  author: string;
  price: number;
  img: string;
  category: Category;
};

export default function CategoryPage() {
  const params = useParams<{ slug?: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Check if user is signed in - redirect to login if not
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isSignedIn()) {
        router.push("/signin");
      }
    }
  }, [router]);
  
  const initialCategory = useMemo(() => {
    const slug = (params?.slug || "").toLowerCase();
    return slugToCategory[slug] ?? "Crafts";
  }, [params?.slug]);

  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory as Category);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<LibProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCategory(initialCategory as Category);
  }, [initialCategory]);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(activeCategory).then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to load products by category:', error);
      setProducts([]);
      setLoading(false);
    });
  }, [activeCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      // Only show approved products (or products without status for backward compatibility)
      const isApproved = !p.status || p.status === "approved";
      if (!isApproved) return false;
      
      // Filter by search query if provided
      if (q) {
        return p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, query]);

  function addToCart(p: Product) {
    console.log("Add to cart:", p.name);
  }

  return (
    <div className="min-h-screen bg-[#efe3ff] text-gray-900">
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) => {
          const qq = q.trim();
          if (qq) router.push(`/search?q=${encodeURIComponent(qq)}`);
        }}
        user={{ name: "Guest" }}
      />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="text-2xl font-semibold mb-4">Category</h1>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const slug = categoryToSlug[cat] || "crafts";
                  router.replace(`/category/${slug}`);
                }}
                className={`px-4 py-2 rounded-xl transition shadow-sm ${
                  active
                    ? "bg-purple-600 text-white"
                    : "bg-[#e8d6ff] text-purple-700 hover:bg-[#ddc6ff]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product cards */}
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
            <article
              key={p.name}
              className="group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition bg-white"
            >
              <div className="relative">
                <Link href={`/product/${toSlug(p.name)}`} className="block">
                  {p.img && p.img.startsWith('data:') ? (
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={640}
                      height={420}
                      className="w-full h-56 object-cover"
                    />
                  )}
                </Link>

                {/* category badge using the map */}
                <span
                  className={`absolute left-3 top-3 text-xs font-semibold px-2 py-1 rounded-full
                              ${categoryBadge[p.category] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {p.category}
                </span>
              </div>

              <div className="p-4">
                <h3 
                  className="font-semibold text-lg cursor-pointer hover:underline"
                  onClick={() => {
                    // Check if user is signed in
                    if (!isSignedIn()) {
                      router.push("/signin");
                    } else {
                      router.push(`/product/${toSlug(p.name)}`);
                    }
                  }}
                >
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500">{p.author}</p>


                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => addToCart(p)}
                    aria-label={`Add ${p.name} to cart`}
                    className="grid place-items-center w-10 h-10 rounded-full
                               bg-white text-purple-600 border border-purple-200 shadow
                               hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>

                  <span className="inline-flex items-center rounded-full bg-emerald-500 text-white text-sm font-semibold px-3 py-1">
                    {p.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
                  </span>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
