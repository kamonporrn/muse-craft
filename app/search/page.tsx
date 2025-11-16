// app/search/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { products, toSlug } from "@/lib/products";

const categorySlugs: Record<string, string> = {
  "Painting": "bg-blue-100 text-blue-800",
  "Sculpture": "bg-amber-100 text-amber-800",
  "Literature (E-book)": "bg-green-100 text-green-800",
  "Graphic Design": "bg-pink-100 text-pink-800",
  "Crafts": "bg-yellow-100 text-yellow-800",
  "Digital Art": "bg-purple-100 text-purple-800",
};

const categoryNames = Object.values(categorySlugs); // รายชื่อหมวดหมู่ภาษาอังกฤษ

export default function SearchPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const initialQ = sp.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  // ฟังก์ชันช่วย: เช็คว่า token อยู่ในข้อความหรือไม่ (ไม่สนใจตัวพิมพ์ใหญ่เล็ก)
  const contains = (text: string, token: string) =>
    text.toLowerCase().includes(token.toLowerCase());

  // ฟิลเตอร์ผลลัพธ์
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    // รองรับทั้งชื่อสินค้า ผู้เขียน และหมวดหมู่ (ทั้งชื่อเต็มและ slug)
    return products.filter((p) => {
      const name = p.name.toLowerCase();
      const author = p.author.toLowerCase();
      const cat = p.category.toLowerCase();

      // ชื่อหมวดแบบ slug (เช่น graphic-design)
      const catSlug = Object.entries(categorySlugs).find(
        ([slug, name]) => name.toLowerCase() === cat
      )?.[0];

      return (
        name.includes(query) ||
        author.includes(query) ||
        cat.includes(query) ||
        (catSlug ? catSlug.includes(query) : false)
      );
    });
  }, [q]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* แถบค้นหาในหน้า Search (ถ้าจะใช้ Navbar ก็ได้) */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.replace(`/search?q=${encodeURIComponent(q)}`);
          }}
          className="flex items-center gap-3"
          role="search"
          aria-label="Search products"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by product name or category (e.g. 'Painting')"
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="rounded-full bg-purple-600 text-white px-5 py-2 hover:bg-purple-700"
          >
            Search
          </button>
        </form>

        {/* ช็อตคัทหมวดหมู่ */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categoryNames.map((c) => (
            <button
              key={c}
              onClick={() => {
                setQ(c);
                router.replace(`/search?q=${encodeURIComponent(c)}`);
              }}
              className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-sm"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* ผลลัพธ์ */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold mb-4">
          Results for: <span className="text-purple-700">“{initialQ}”</span>
        </h2>

        {results.length === 0 ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((p) => (
              <Link
                key={p.name}
                href={`/product/${toSlug(p.name)}`}
                className="group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition bg-white"
              >
                <div className="relative">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={640}
                    height={420}
                    className="w-full h-56 object-cover"
                  />
                  <span className="absolute left-3 top-3 text-xs px-2 py-1 rounded-full bg-white/90 border border-gray-200">
                    {p.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.author}</p>
                  <p className="mt-2 text-purple-600 font-semibold">
                    {p.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}