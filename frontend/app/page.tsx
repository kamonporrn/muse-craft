// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Palette,
  Diamond,
  PenTool,
  Scissors,
  Shapes,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { products, toSlug } from "@/lib/products";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Featured (link to real products by name)
  const featuredNames = ["Mystery Way", "The Changeling Worlds", "Ocean Whisper"];
  const featured = featuredNames
    .map((name) => products.find((p) => p.name === name))
    .filter(Boolean) as typeof products;

  const [active, setActive] = useState(0);

  // Auto-rotate every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % featured.length);
    }, 3000);
    return () => clearInterval(id);
  }, [featured.length]);

  // Best seller list (filter by search, then sort by rating desc, price desc as tie-break)
  const bestSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) =>
      q ? p.name.toLowerCase().includes(q) : true
    );
    list = list.sort((a, b) => (b.rating - a.rating) || (b.price - a.price));
    return list.slice(0, 8); // show top 8
  }, [search]);

  const categoryBadge: Record<string, string> = {
    painting: "bg-yellow-100 text-yellow-800",
    sculpture: "bg-indigo-100 text-indigo-800",
    literature: "bg-green-100 text-green-800",
    "graphic-design": "bg-pink-100 text-pink-800",
    crafts: "bg-amber-100 text-amber-800",
    "digital-art": "bg-blue-100 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) => {
          const qq = q.trim();
          if (qq) router.push(`/search?q=${encodeURIComponent(qq)}`);
        }}
      />

      {/* ===== Featured Section ===== */}
      <motion.section
        className="px-8 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[420px] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {featured.map((item, i) => {
              const n = featured.length;
              const diff = (i - active + n) % n; // 0,1,2...
              const x = diff === 0 ? 0 : diff === 1 ? 400 : -400;
              const scale = diff === 0 ? 1 : 0.75;
              const opacity = diff === 0 ? 1 : 0.6;
              const zIndex = diff === 0 ? 30 : 20;
              const blur = diff === 0 ? "backdrop-blur-0" : "backdrop-blur-[1px]";

              return (
                <motion.div
                  key={item.name}
                  className={`absolute w-[85%] md:w-[360px] ${blur} cursor-pointer`}
                  animate={{ x, scale, opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  style={{ zIndex }}
                  onClick={() => router.push(`/product/${toSlug(item.name)}`)}
                >
                  <div className="bg-purple-50 rounded-2xl p-4 text-center shadow-sm border border-purple-100">
                    <p className="text-xs md:text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full inline-block mb-2">
                      {item.category}
                    </p>
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={360}
                      height={220}
                      className="mx-auto rounded-lg object-cover w-full h-[200px] md:h-[220px]"
                    />
                    <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.author}</p>
                    <button
                      className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/product/${toSlug(item.name)}`);
                      }}
                    >
                      More Detail
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-purple-600" : "w-2 bg-purple-300"
              }`}
            />
          ))}
        </div>
      </motion.section>

      {/* ===== Shop by Category ===== */}
      <section className="px-8 py-10 text-center">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

        {(() => {
          const categories = [
            { key: "painting", title: "Painting", desc: "Oil, watercolor, acrylic", Icon: Palette },
            { key: "sculpture", title: "Sculpture", desc: "Clay, wood, stone carving", Icon: Shapes },
            { key: "literature", title: "Literature (E-book)", desc: "Novels, poetry, short stories", Icon: BookOpen },
            { key: "graphic-design", title: "Graphic Design", desc: "Branding, posters, layouts", Icon: PenTool },
            { key: "crafts", title: "Crafts", desc: "Weaving, ceramics, jewelry, mobiles", Icon: Scissors },
            { key: "digital-art", title: "Digital Art", desc: "Illustrations & concept art", Icon: ImageIcon },
          ];

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map(({ key, title, desc, Icon }) => (
                <div
                  key={key}
                  className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition flex flex-col items-center group cursor-pointer"
                  onClick={() => router.push(`/category/${key}`)}
                >
                  <Icon className="w-10 h-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* ===== Best Seller ===== */}
      <section className="px-8 py-10">
        <h2 className="text-2xl font-bold mb-6">Best Seller</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={`/product/${toSlug(item.name)}`}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block"
            >
              <div className="relative">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {/* Category badge on image */}
                <span
                  className={`absolute left-3 top-3 text-xs font-semibold px-2 py-1 rounded-full
                              ${categoryBadge[item.category] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {item.category}
                </span>
              </div>

              <div className="p-4">
                {/* keep the line below if you want category text under the image too */}
                {/* <p className="text-sm text-green-600 font-medium mb-1">{item.category}</p> */}
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.author}</p>
                <p className="text-purple-600 font-semibold mt-2">
                  {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
