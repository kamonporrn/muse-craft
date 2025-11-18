// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Palette,
  PenTool,
  Scissors,
  Shapes,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { useRouter } from "next/navigation";
import { getProducts, toSlug, type Product } from "@/lib/products";
import { isSignedIn, getUserName } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  // Search state (shared to Navbar / NavbarSignedIn)
  const [search, setSearch] = useState("");

  // Signed-in state for swapping navbar
  const [signed, setSigned] = useState(false);
  const [userName, setUserName] = useState("Muse User");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // read only on client
    setSigned(isSignedIn());
    setUserName(getUserName());

    // Fetch products from API
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to load products:', error);
      setLoading(false);
    });
  }, []);

  // Featured picks - only approved products from API (no hardcoded names)
  const featured = useMemo(() => {
    const approved = products.filter((p) => !p.status || p.status === "approved");
    return approved.slice(0, 3); // Show first 3 approved products
  }, [products]);

  const [active, setActive] = useState(0);

  // Auto-rotate every 3s
  useEffect(() => {
    if (featured.length < 2) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(id);
  }, [featured.length]);

  // Best sellers (filter by search, only approved products, sort by price desc)
  const bestSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) => {
      // Only show approved products (or products without status for backward compatibility)
      const isApproved = !p.status || p.status === "approved";
      if (!isApproved) return false;
      
      // Filter by search query if provided
      if (q) {
        return p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
      }
      return true;
    });
    list = list.sort((a, b) => b.price - a.price);
    return list.slice(0, 4); // show top 4
  }, [search, products]);

  // Badge classes keyed by category TITLE
  const categoryBadge: Record<string, string> = {
    "Painting": "bg-yellow-100 text-yellow-800",
    "Sculpture": "bg-indigo-100 text-indigo-800",
    "Literature (E-book)": "bg-green-100 text-green-800",
    "Graphic Design": "bg-pink-100 text-pink-800",
    "Crafts": "bg-amber-100 text-amber-800",
    "Digital Art": "bg-blue-100 text-blue-800",
  };

  const onSearchSubmit = (q: string) => {
    const qq = q.trim();
    if (!qq) return;
    router.push(`/search?q=${encodeURIComponent(qq)}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Swap Navbar by signed-in status */}
      {signed ? (
        <NavbarSignedIn
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={onSearchSubmit}
          user={{ name: userName, avatarUrl: "/avatar.jpeg" }}
          cartCount={"10+"}
          onCartClick={() => router.push("/cart")}
          onBellClick={() => console.log("notifications")}
        />
      ) : (
        <Navbar
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={onSearchSubmit}
        />
      )}

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
              const diff = (i - active + n) % n; // 0 = center, 1 = right, 2 = left
              const x = diff === 0 ? 0 : diff === 1 ? 400 : -400;
              const scale = diff === 0 ? 1 : 0.75;
              const opacity = diff === 0 ? 1 : 0.6;
              const zIndex = diff === 0 ? 30 : 20;
              const blurStyle = diff === 0 ? { backdropFilter: 'none', WebkitBackdropFilter: 'none' } : { backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)' };

              return (
                <motion.div
                  key={item.id || item.name}
                  className="absolute w-[85%] md:w-[360px] cursor-pointer"
                  animate={{ x, scale, opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  style={{ zIndex, ...blurStyle }}
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
                        // Check if user is signed in
                        if (!signed) {
                          router.push("/signin");
                        } else {
                          router.push(`/product/${toSlug(item.name)}`);
                        }
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
                  onClick={() => {
                    // Check if user is signed in
                    if (!signed) {
                      router.push("/signin");
                    } else {
                      router.push(`/category/${key}`);
                    }
                  }}
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
          {bestSellers.map((item) => (
            <div
              key={item.id || item.name}
              onClick={() => {
                // Check if user is signed in
                if (!signed) {
                  router.push("/signin");
                } else {
                  router.push(`/product/${toSlug(item.name)}`);
                }
              }}
              className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block"
            >
              <div className="relative">
                {item.img && item.img.startsWith('data:') ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                )}
                {/* Category badge on image */}
                <span
                  className={`absolute left-3 top-3 text-xs font-semibold px-2 py-1 rounded-full
                    ${categoryBadge[item.category] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {item.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500">{item.author}</p>
                <p className="text-purple-600 font-semibold mt-2">
                  {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
