"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, BookOpen, Palette, Diamond } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [search, setSearch] = useState("");

  // ข้อมูลสำหรับสไลด์
  const featured = [
    {
      tag: "E-book",
      tagClass: "bg-green-200 text-green-800",
      img: "/book1.jpg",
      title: "Mystery Way",
      sub: "Writer: Adrian Blake",
    },
    {
      tag: "Digital Art",
      tagClass: "bg-yellow-200 text-yellow-800",
      img: "/art1.jpg",
      title: "The Changeling Worlds",
      sub: "Artist: Arwang",
    },
    {
      tag: "Digital Art",
      tagClass: "bg-yellow-200 text-yellow-800",
      img: "/art2.jpg",
      title: "Ocean's Whisper",
      sub: "Artist: Clara Everwood",
    },
  ];

  const [active, setActive] = useState(0);

  // เปลี่ยนสไลด์อัตโนมัติทุก 3 วินาที
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % featured.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onSignIn={() => console.log("Sign In clicked")}
        onSignUp={() => console.log("Sign Up clicked")}
      />

      {/* ===== Featured Section ===== */}
      <motion.section
        className="px-8 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-full max-w-5xl mx-auto h-[360px] md:h-[380px] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {featured.map((item, i) => {
              // คำนวณการวางตำแหน่งแบบวงกลม: 0 = กลาง, 1 = ขวา, 2 = ซ้าย
              const n = featured.length;
              const diff = (i - active + n) % n; // 0,1,2...
              const x =
                diff === 0 ? 0 :
                diff === 1 ? 260 : // ขวา
                -260;              // ซ้าย

              const scale = diff === 0 ? 1 : 0.85;
              const opacity = diff === 0 ? 1 : 0.7;
              const zIndex = diff === 0 ? 30 : 20;
              const blur = diff === 0 ? "backdrop-blur-0" : "backdrop-blur-[1px]";

              return (
                <motion.div
                  key={i}
                  className={`absolute w-[85%] md:w-[360px] ${blur}`}
                  animate={{ x, scale, opacity }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  style={{ zIndex }}
                  onClick={() => setActive(i)}
                >
                  <div className="bg-purple-50 rounded-2xl p-4 text-center shadow-sm border border-purple-100">
                    <p className={`text-xs md:text-sm ${item.tagClass} px-2 py-1 rounded-full inline-block mb-2`}>
                      {item.tag}
                    </p>
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={360}
                      height={220}
                      className="mx-auto rounded-lg object-cover w-full h-[200px] md:h-[220px]"
                    />
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.sub}</p>
                    <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                      More Detail
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ตัวชี้ (Indicators) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
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
        </div>
      </motion.section>


      {/* ===== Shop by Category ===== */}
      <section className="px-8 py-10 text-center">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Writing */}
          <div className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition flex flex-col items-center">
            <BookOpen className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg">Writing</h3>
            <p className="text-gray-500">E-book & Digital Literature</p>
          </div>

          {/* Artwork */}
          <div className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition flex flex-col items-center">
            <Palette className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg">Artwork</h3>
            <p className="text-gray-500">Painting</p>
          </div>

          {/* Graphic Design */}
          <div className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition flex flex-col items-center">
            <Diamond className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg">Graphic Design</h3>
            <p className="text-gray-500">Visual Art</p>
          </div>
        </div>
      </section>

      {/* ===== Best Seller ===== */}
      <section className="px-8 py-10">
        <h2 className="text-2xl font-bold mb-6">Best seller</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Mystery Way", tag: "E-book", price: 149 },
            { title: "Demon", tag: "Graphic design", price: 149 },
            { title: "After Sunset", tag: "Art", price: 249 },
            { title: "Fuji", tag: "Art", price: 149 },
          ].map((item, index) => (
            <div
              key={index}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <Image
                src={`/best${index + 1}.jpg`}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-green-600 font-medium mb-1">
                  {item.tag}
                </p>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-purple-600 font-semibold mt-2">
                  {item.price}.00 ฿
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
