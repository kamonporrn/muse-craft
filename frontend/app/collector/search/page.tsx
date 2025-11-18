// app/search/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchProductsByQuery, toSlug, type Product } from "@/lib/products";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { isSignedIn } from "@/lib/auth";

const categorySlugs: Record<string, string> = {
  "Painting": "bg-blue-100 text-blue-800",
  "Sculpture": "bg-amber-100 text-amber-800",
  "Literature (E-book)": "bg-green-100 text-green-800",
  "Graphic Design": "bg-pink-100 text-pink-800",
  "Crafts": "bg-yellow-100 text-yellow-800",
  "Digital Art": "bg-purple-100 text-purple-800",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const initialQ = (searchParams?.q ?? "").toString();
  const [query, setQuery] = useState(initialQ);
  const router = useRouter();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = searchProductsByQuery(q);
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to search products:', error);
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <NavbarSignedIn
        search={query}
        onSearchChange={setQuery}
        user={{ name: "Guest" }}
        onSearchSubmit={(q) => {
          const qq = q.trim();
          router.replace(qq ? `/search?q=${encodeURIComponent(qq)}` : "/search");
        }}
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-semibold mb-2">Search results</h1>
        {!!query.trim() && (
          <p className="text-sm text-gray-500 mb-6">
            Showing results for: <span className="font-medium">“{query}”</span>
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Searching...</p>
        ) : !query.trim() ? (
          <p className="text-gray-500">Type a keyword to search products by name, author, or category.</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((p) => (
              <div
                key={p.name}
                onClick={() => {
                  // Check if user is signed in
                  if (!isSignedIn()) {
                    router.push("/signin");
                  } else {
                    router.push(`/product/${toSlug(p.name)}`);
                  }
                }}
                className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block bg-white"
              >
                <div className="relative">
                  {p.img && p.img.startsWith('data:') ? (
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={320}
                      height={220}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <span
                    className={`absolute left-3 top-3 text-[11px] font-semibold px-2 py-1 rounded-full
                                ${categorySlugs[p.category] ?? "bg-gray-100 text-gray-800"}`}
                  >
                    {p.category}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold leading-snug line-clamp-2">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.author}</p>
                  <p className="text-purple-600 font-semibold mt-2">
                    {p.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
