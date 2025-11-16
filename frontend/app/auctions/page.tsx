// app/auctions/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Paintbrush, Shapes, BookOpenText, PenTool, Scissors, ImageIcon,
  UserRound, ShoppingCart,
} from "lucide-react";
import { categoryToSlug } from "@/lib/auction-categories";
import { auctions, listAuctions, getStatus, type Auction, type AuctionStatus } from "@/lib/auctions";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-gray-800">{children}</h2>;
}

function CategoryCardLink({ icon: Icon, title, subtitle }:{
  icon: any; title: string; subtitle: string;
}) {
  const slug = categoryToSlug[title as keyof typeof categoryToSlug] ?? "";
  return (
    <Link
      href={`/auctions/category/${slug}`}
      className="flex w-full items-center gap-3 rounded-xl bg-purple-50 px-5 py-4 ring-1 ring-purple-100 hover:bg-purple-100 text-left"
    >
      <div className="rounded-xl bg-white p-2 ring-1 ring-purple-200">
        <Icon className="h-5 w-5 text-fuchsia-600" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-800">{title}</div>
        <div className="text-[11px] text-gray-500">{subtitle}</div>
      </div>
    </Link>
  );
}

function BidCard({ img, place, price }: { img: string; place: string; price: string }) {
  return (
    <article className="group flex w-56 flex-col items-center gap-2">
      <div className="overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm">
        <Image
          src={img}
          alt={place}
          width={448}
          height={336}
          className="h-40 w-56 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="text-center text-sm text-gray-700 font-medium">{place}</div>
      <div className="text-center text-sm text-gray-500">{price}</div>
    </article>
  );
}

function ClosedCard({ img, title, final, slug }: { img: string; title: string; final: string; slug?: string }) {
  const Wrapper: any = slug ? Link : "div";
  const props = slug ? { href: `/auctions/${slug}` } : {};
  return (
    <Wrapper {...props} className="flex w-56 flex-col items-center gap-2">
      <div className="overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm">
        <Image src={img} alt={title} width={448} height={336} className="h-40 w-56 object-cover" />
      </div>
      <div className="text-center text-sm font-medium text-gray-800 line-clamp-1">{title}</div>
      <div className="text-center text-xs text-gray-500">Final Bid: {final}</div>
    </Wrapper>
  );
}

export default function AuctionsLikeDemo() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<
    "All" | Auction["category"]
  >("All");

  // ====== Data mapping to demo sections ======

  // Top 3 Highest Bids ⇒ จาก live auctions เรียง currentBid มาก→น้อย
  const top3 = useMemo(() => {
    const live = auctions.filter(a => getStatus(a) === "live");
    return [...live].sort((a, b) => b.currentBid - a.currentBid).slice(0, 3);
  }, []);

  // Recently Closed ⇒ จาก closed auctions ล่าสุด 6 รายการ
  const recentlyClosed = useMemo(() => {
    const closed = auctions.filter(a => getStatus(a) === "closed");
    return [...closed]
      .sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime())
      .slice(0, 6);
  }, []);

  // กรอง/ค้นหา “รายการหน้าเดียวกัน” (แสดงในส่วน Recently Closed อยู่แล้ว, ถ้าต้องโชว์ grid รวมเพิ่มได้)
  const filteredCategory = useMemo(
    () => (category === "All" ? "all" : category),
    [category]
  );
  const filteredList = useMemo(
    () =>
      listAuctions({
        q: query,
        category: filteredCategory === "all" ? "all" : (filteredCategory as Auction["category"]),
        status: "all",
      }),
    [query, filteredCategory]
  );

  const submitSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // ถ้าอยากไปหน้า /search ก็ใช้ router.push แทนการกรองในหน้า
    // router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }, []);

  const CATS = [
    { key: "Painting", title: "Painting", subtitle: "Oil, watercolor, acrylic", Icon: Paintbrush },
    { key: "Sculpture", title: "Sculpture", subtitle: "Clay, wood, stone carving", Icon: Shapes },
    { key: "Literature (E-book)", title: "Literature (E-book)", subtitle: "Novels, poetry, short stories", Icon: BookOpenText },
    { key: "Graphic Design", title: "Graphic Design", subtitle: "Branding, posters, layouts", Icon: PenTool },
    { key: "Crafts", title: "Crafts", subtitle: "Weaving, ceramics, jewelry, mobiles", Icon: Scissors },
    { key: "Digital Art", title: "Digital Art", subtitle: "Illustrations & concept art", Icon: ImageIcon },
  ] as const;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* โลโก้กดแล้วไปหน้า Home */}
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.png" alt="MuseCraft" width={44} height={44} className="cursor-pointer" />
            </Link>

            <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
              <Link className="hover:text-fuchsia-700" href="/">Home</Link>
              <a className="hover:text-fuchsia-700" href="#categories">Categories</a>
              <Link className="hover:text-fuchsia-700" href="/bids">My Bids</Link>
              <Link className="hover:text-fuchsia-700" href="/watchlist">Watchlist</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form
              onSubmit={submitSearch}
              className="hidden items-center rounded-full bg-purple-50 px-3 py-2 ring-1 ring-purple-100 md:flex"
              role="search"
              aria-label="Site search"
            >
              <Search className="mr-2 h-4 w-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-56 bg-transparent text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none"
                aria-label="Search input"
              />
            </form>

            <Link
              href="/sell"
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Sell
            </Link>
            <Link href="/account" className="rounded-full p-2 hover:bg-gray-100" aria-label="Account">
              <UserRound className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="rounded-full p-2 hover:bg-gray-100" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* Top 3 Highest Bids */}
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">Top 3 Highest Bids</h3>
        <div className="flex flex-wrap items-start justify-center gap-10">
          {top3.map((a, i) => (
            <Link key={a.slug} href={`/auctions/${a.slug}`}>
              <BidCard img={a.img} place={`${i + 1}st Place`} price={`$${a.currentBid.toLocaleString()}`} />
            </Link>
          ))}
        </div>

        {/* Shop by Category */}
        <div id="categories" className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 text-center text-sm font-semibold text-gray-700">Shop by Category</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <CategoryCardLink icon={Paintbrush} title="Painting" subtitle="Oil, watercolor, acrylic" />
            <CategoryCardLink icon={Shapes} title="Sculpture" subtitle="Clay, wood, stone carving" />
            <CategoryCardLink icon={BookOpenText} title="Literature (E-book)" subtitle="Novels, poetry, short stories" />
            <CategoryCardLink icon={PenTool} title="Graphic Design" subtitle="Branding, posters, layouts" />
            <CategoryCardLink icon={Scissors} title="Crafts" subtitle="Weaving, ceramics, jewelry, mobiles" />
            <CategoryCardLink icon={ImageIcon} title="Digital Art" subtitle="Illustrations & concept art" />
          </div>

          {/* แถบสถานะ และผลลัพธ์ค้นหา/กรอง (ย่อ) */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredList.length}</span> items
            {category !== "All" ? <> in <span className="font-semibold">{category}</span></> : null}
            {query.trim() ? <> for “<span className="font-semibold">{query.trim()}</span>”</> : null}
          </div>
        </div>

        {/* Recently Closed Auctions */}
        <div className="mt-10">
          <SectionTitle>Recently Closed Auctions</SectionTitle>
          <div className="mt-4 flex flex-wrap items-start gap-8">
            {recentlyClosed.map((c) => (
              <ClosedCard
                key={c.slug}
                img={c.img}
                title={c.titleEN}
                final={`$${c.currentBid.toLocaleString()}`}
                slug={c.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
