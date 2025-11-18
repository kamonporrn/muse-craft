// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, MouseEvent } from "react";
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

  // Signed-in state for swapping navbar + guard
  const [signed, setSigned] = useState(false);
  const [userName, setUserName] = useState("Muse User");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSigned(isSignedIn());
    setUserName(getUserName());

    // Fetch products from store
    try {
      const data = getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  }, []);

  // Featured picks (ensure names match your data exactly)
  const featuredNames = ["Mystery Way", "The Changeling Worlds", "Ocean Whisper"];
  const featured = featuredNames
    .map((name) => products.find((p) => p.name === name))
    .filter(Boolean) as typeof products;

  const [active, setActive] = useState(0);

  // Auto-rotate every 7s
  useEffect(() => {
    if (featured.length < 2) return;
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % featured.length),
      7000
    );
    return () => clearInterval(id);
  }, [featured.length]);

  // Best sellers (filter by search, only approved products, sort by price desc)
  const bestSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) =>
      q ? p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) : true
    );
    list = list.sort((a, b) => (b.rating - a.rating) || (b.price - a.price));
    return list.slice(0, 4); // show top 4
  }, [products, search]);

  // Badge classes keyed by category TITLE
  const categoryBadge: Record<string, string> = {
    Painting: "bg-yellow-100 text-yellow-800",
    Sculpture: "bg-indigo-100 text-indigo-800",
    "Literature (E-book)": "bg-green-100 text-green-800",
    "Graphic Design": "bg-pink-100 text-pink-800",
    Crafts: "bg-amber-100 text-amber-800",
    "Digital Art": "bg-blue-100 text-blue-800",
  };

  const onSearchSubmit = (q: string) => {
    const qq = q.trim();
    if (!qq) return;
    if (!signed) {
      alert("กรุณา Sign in ก่อนเพื่อค้นหาและดูเนื้อหา");
      router.push("/signin");
      return;
    }
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
          onCartClick={() => {
            if (!signed) {
              alert("กรุณา Sign in ก่อนเพื่อดูตะกร้าสินค้า");
              router.push("/signin");
              return;
            }
            router.push("/cart");
          }}
          onBellClick={() => {
            if (!signed) {
              alert("กรุณา Sign in ก่อนเพื่อดูการแจ้งเตือน");
              router.push("/signin");
              return;
            }
            console.log("notifications");
          }}
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
        <div className="relative mx-auto h-[400px] w-full max-w-6xl overflow-hidden md:h-[420px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {featured.map((item, i) => {
              const n = featured.length;
              const diff = (i - active + n) % n; // 0 = center, 1 = right, 2 = left
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
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-center shadow-sm">
                    <p className="mb-2 inline-block rounded-full bg-yellow-200 px-2 py-1 text-xs text-yellow-800 md:text-sm">
                      {item.category}
                    </p>
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={360}
                      height={220}
                      className="mx-auto h-[200px] w-full rounded-lg object-cover md:h-[220px]"
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
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>

        {(() => {
          const categories = [
            {
              key: "painting",
              title: "Painting",
              desc: "Oil, watercolor, acrylic",
              Icon: Palette,
            },
            {
              key: "sculpture",
              title: "Sculpture",
              desc: "Clay, wood, stone carving",
              Icon: Shapes,
            },
            {
              key: "literature",
              title: "Literature (E-book)",
              desc: "Novels, poetry, short stories",
              Icon: BookOpen,
            },
            {
              key: "graphic-design",
              title: "Graphic Design",
              desc: "Branding, posters, layouts",
              Icon: PenTool,
            },
            {
              key: "crafts",
              title: "Crafts",
              desc: "Weaving, ceramics, jewelry, mobiles",
              Icon: Scissors,
            },
            {
              key: "digital-art",
              title: "Digital Art",
              desc: "Illustrations & concept art",
              Icon: ImageIcon,
            },
          ];

          return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {categories.map(({ key, title, desc, Icon }) => (
                <div
                  key={key}
                  className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition flex flex-col items-center group cursor-pointer"
                  onClick={() => router.push(`/category/${key}`)}
                >
                  <Icon className="mb-3 h-10 w-10 text-purple-600 transition-transform group-hover:scale-110" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* ===== Best Seller ===== */}
      <section className="px-8 py-10">
        <h2 className="mb-6 text-2xl font-bold">Best Seller</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((item) => (
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
