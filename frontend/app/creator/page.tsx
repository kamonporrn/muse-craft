"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus, Images, Search, LogOut, UserRound, BarChart3
} from "lucide-react";

type Slide = { img: string; title: string; author: string };

export default function CreatorHomePage() {
  const router = useRouter();

  // ===== Guard: ต้องเป็น creator =====
  const [ok, setOk] = useState(false);
  const [userName, setUserName] = useState("Creator");
  useEffect(() => {
    try {
      const role = localStorage.getItem("musecraft.role");
      const name = localStorage.getItem("musecraft.userName") || "Creator";
      setUserName(name);
      if (role === "creator") setOk(true);
      else router.replace("/role");
    } catch {
      router.replace("/role");
    }
  }, [router]);

  // ===== Slides =====
  const slides: Slide[] = useMemo(
    () => [
      { img: "/mystery.jpg",     title: "Mystery Way",         author: "Adrian Blake" },
      { img: "/changeworld.jpg", title: "The Changing Worlds", author: "Aranang" },
      { img: "/ocean.jpg",       title: "Ocean's Whisper",     author: "Clara Everwood" },
    ],
    []
  );
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 2000);
    return () => clearInterval(t);
  }, [slides.length]);

  // ===== Actions =====
  const gotoUpload = () => router.push("/creator/upload");      // อัปโหลดชิ้นงานสำหรับขาย (Sell)
  const gotoMyArtworks = () => router.push("/creator/artworks");
  const gotoAnalytics = () => router.push("/creator/analytics");

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem("musecraft.signedIn");
      localStorage.removeItem("musecraft.userName");
      localStorage.removeItem("musecraft.role");
    } catch {}
    window.location.href = "/"; // กลับหน้า Home ชัวร์ ๆ
  }, []);

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-gray-700">
        Checking permission…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ===== Navbar (Creator) ===== */}
      <nav className="sticky top-0 z-40 border-b border-purple-100 bg-white/80" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="MuseCraft" width={44} height={44} />
              <div className="text-xl font-semibold text-purple-700">Creator</div>
            </div>

            <div className="hidden md:flex items-center rounded-full bg-purple-50 px-3 py-2 ring-1 ring-purple-100">
              <Search className="mr-2 h-4 w-4 text-gray-500" />
              <input
                placeholder="Search my artworks…"
                className="w-64 bg-transparent text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={gotoMyArtworks}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Images className="h-4 w-4 text-purple-600" />
              My Artworks
            </button>
            <button
              onClick={gotoAnalytics}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Analytics
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 text-rose-600" />
              Sign out
            </button>
            <div className="ml-1 inline-flex items-center gap-2 rounded-full bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white">
              <UserRound className="h-4 w-4" />
              {userName}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Top CTA row ===== */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={gotoUpload}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Upload Artwork (Sell)
          </button>
          <button
            onClick={gotoMyArtworks}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Images className="h-4 w-4 text-purple-600" />
            Manage My Artworks
          </button>
        </div>
      </section>

      {/* ===== Slider ===== */}
      <section className="mx-auto mt-6 max-w-6xl px-4">
        <div className="rounded-2xl bg-purple-50 p-6 ring-1 ring-purple-100">
          <h2 className="mb-3 text-center text-lg font-semibold text-gray-800">
            Featured Inspirations
          </h2>
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-700"
              style={{ transform: `translateX(-${current * 320}px)` }}
            >
              {slides.map((s, i) => (
                <div
                  key={i}
                  className="w-[300px] flex-shrink-0 rounded-xl bg-white p-3 ring-1 ring-black/5 shadow-sm"
                >
                  {/* ใช้ <Image> ถ้ารูปอยู่ใน /public */}
                  <img
                    src={s.img}
                    alt={s.title}
                    className="h-44 w-full rounded-lg object-cover"
                  />
                  <div className="mt-2">
                    <div className="text-sm font-semibold text-gray-800">{s.title}</div>
                    <div className="text-xs text-gray-500">by {s.author}</div>
                    <button
                      onClick={gotoMyArtworks}
                      className="mt-2 w-full rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                    >
                      More Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Quick categories ===== */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-3 text-center text-lg font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActionCard
            emoji="🖼️"
            title="Upload for Sell"
            desc="E-book, painting, digital files"
            onClick={gotoUpload}
          />
          <ActionCard
            emoji="📊"
            title="Analytics"
            desc="Sales, views, conversion"
            onClick={gotoAnalytics}
          />
        </div>
      </section>

      {/* ===== My Best Sellers (demo) ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">My Best Sellers</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <ProductCard
            img="/mystery.jpg"
            tag="E-book"
            title="Mystery way"
            author="Adrian Blake"
            price="149.00 B"
          />
          <ProductCard
            img="/demon.jpg"
            tag="Graphic design"
            title="Demon"
            author="Adrian Blake"
            price="149.00 B"
          />
          <ProductCard
            img="/after.jpg"
            tag="Art"
            title="After Sunset"
            author="Kenneth Bulmer"
            price="249.00 B"
          />
        </div>
      </section>
    </main>
  );
}

/* ===== Small components ===== */

function ActionCard({
  emoji, title, desc, onClick,
}: { emoji: string; title: string; desc: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl bg-purple-50 p-4 text-left ring-1 ring-purple-100 transition hover:bg-purple-100"
    >
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-sm font-semibold text-gray-800">{title}</div>
      <div className="text-xs text-gray-500">{desc}</div>
      <div className="mt-3 inline-flex items-center text-xs font-semibold text-purple-700 group-hover:underline">
        Get started →
      </div>
    </button>
  );
}

function ProductCard({
  img, tag, title, author, price,
}: { img: string; tag: string; title: string; author: string; price: string }) {
  return (
    <article className="relative w-60 rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5">
      <span className="absolute left-2 top-2 rounded-md bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
        {tag}
      </span>
      <img src={img} alt={title} className="h-36 w-full rounded-lg object-cover" />
      <div className="p-2">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{author}</div>
        <div className="mt-1 text-sm font-semibold text-emerald-600">{price}</div>
      </div>
    </article>
  );
}
