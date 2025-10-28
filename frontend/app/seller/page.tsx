// app/seller/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

type Slide = { img: string; title: string; author: string };
type Product = { img: string; title: string; author: string; price: number; tag: string };

export default function SellerPage() {
  const router = useRouter();

  // --- demo data ---
  const slides: Slide[] = [
    { img: "/mystery.jpg", title: "Mystery Way", author: "Writer: Adrian Blake" },
    { img: "/changeworld.jpg", title: "The Changing Worlds", author: "Artist: Aranang" },
    { img: "/ocean.jpg", title: "Ocean's Whisper", author: "Artist: Clara Everwood" },
  ];

  const products: Product[] = [
    { img: "/mystery.jpg", title: "Mystery Way", author: "Adrian Blake", price: 149, tag: "E-book" },
    { img: "/demon.jpg", title: "Demon", author: "Adrian Blake", price: 149, tag: "Graphic design" },
    { img: "/after.jpg", title: "After Sunset", author: "Kenneth Bulmer", price: 249, tag: "Art" },
  ];

  // --- state ---
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");

  // autoplay slider
  useEffect(() => {
    const id = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 1800);
    return () => clearInterval(id);
  }, [slides.length]);

  // search filter (title/author/tag)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
    );
  }, [products, query]);

  // helpers
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-20 flex items-center gap-4 justify-between px-6 md:px-10 py-3 bg-purple-600 text-white shadow">
        {/* Logo → Home */}
        <button
          onClick={() => router.push("/")}
          className="font-bold text-lg tracking-wide hover:opacity-90"
          aria-label="Go to Home"
        >
          MuseShop
        </button>

        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or tag"
          className="hidden md:block w-[42%] max-w-[640px] rounded-full bg-white/95 text-gray-900 px-4 py-2 outline-none focus:ring-4 focus:ring-white/30"
        />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/cart")}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15"
            aria-label="Cart"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
          <button
            onClick={() => router.push("/signin")}
            className="hidden sm:inline-block bg-white text-purple-700 px-3 py-1.5 rounded-md font-semibold hover:opacity-95"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="bg-purple-800 px-3 py-1.5 rounded-md font-semibold hover:opacity-95"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Top bar: Add Sell Item */}
      <div className="flex justify-end px-6 md:px-10 py-4">
        <button
          onClick={() => router.push("/seller/new")}
          className="h-10 rounded-md bg-purple-600 text-white px-4 font-semibold hover:bg-purple-700"
        >
          + Add Sell Item
        </button>
      </div>

      {/* SLIDER */}
      <section className="w-full bg-purple-50 py-10 flex justify-center">
        <div
          className="flex gap-6 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 340}px)` }}
          role="list"
          aria-label="Featured slides"
        >
          {slides.map((s) => (
            <div
              key={s.title}
              className="w-[300px] flex-shrink-0 rounded-xl bg-purple-100 p-4 shadow-sm"
              role="listitem"
            >
              {/* ใช้ img ธรรมดา เพราะเป็นเดโม่/ไฟล์ public */}
              <img
                src={s.img}
                alt={s.title}
                className="w-full h-44 object-cover rounded-lg"
              />
              <div className="mt-3">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.author}</p>
                <button
                  onClick={() => router.push(`/product/${slugify(s.title)}`)}
                  className="mt-3 rounded-md bg-purple-600 text-white px-3 py-1.5 text-sm font-semibold hover:bg-purple-700"
                >
                  More Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 md:px-10 py-10">
        <h2 className="text-2xl font-bold text-center">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/category/literature")}
            className="rounded-xl border border-purple-200 bg-purple-50 px-6 py-5 hover:shadow-md transition"
          >
            <div className="text-3xl">📖</div>
            <h4 className="mt-2 font-semibold">Writing</h4>
            <p className="text-gray-600 text-sm">E-book & Digital Literature</p>
          </button>

          <button
            onClick={() => router.push("/category/painting")}
            className="rounded-xl border border-purple-200 bg-purple-50 px-6 py-5 hover:shadow-md transition"
          >
            <div className="text-3xl">🎨</div>
            <h4 className="mt-2 font-semibold">Artwork</h4>
            <p className="text-gray-600 text-sm">Painting</p>
          </button>

          <button
            onClick={() => router.push("/category/graphic-design")}
            className="rounded-xl border border-purple-200 bg-purple-50 px-6 py-5 hover:shadow-md transition"
          >
            <div className="text-3xl">🖌️</div>
            <h4 className="mt-2 font-semibold">Graphic Design</h4>
            <p className="text-gray-600 text-sm">Visual Art</p>
          </button>
        </div>
      </section>

      {/* BEST SELLER (filtered by search) */}
      <section className="px-6 md:px-10 pb-12">
        {/* search (mobile) */}
        <div className="md:hidden mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or tag"
            className="w-full rounded-full border border-gray-200 px-4 py-2 outline-none focus:ring-4 focus:ring-purple-200"
          />
        </div>

        <h2 className="text-2xl font-bold">Best Seller</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <article
              key={p.title}
              className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition p-3"
            >
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <span className="absolute mt-[-150px] ml-2 inline-block rounded-md bg-purple-600 px-2 py-0.5 text-xs text-white">
                {p.tag}
              </span>

              <div className="mt-3">
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-gray-500 text-sm">{p.author}</p>
                <p className="text-emerald-600 font-semibold mt-1">
                  {p.price.toFixed(2)} B
                </p>

                {/* seller actions (demo) */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => router.push(`/seller/edit/${slugify(p.title)}`)}
                    className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert("Removed (demo)")}
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
