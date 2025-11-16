"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Clock, Filter } from "lucide-react";
import { slugToCategory, type Category } from "@/lib/auction-categories";
import { auctions, listAuctions, getStatus, type AuctionStatus } from "@/lib/auctions";

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function AuctionCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const category: Category | undefined = slugToCategory[String(slug)];
  // ถ้า slug ไม่ตรง category ให้ย้อนกลับ /auctions
  if (!category) {
    if (typeof window !== "undefined") router.replace("/auctions");
    return null;
  }

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AuctionStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "bid_desc" | "bid_asc">("latest");

  // ดึงรายการตาม category + search + status
  const items = useMemo(() => {
    let list = listAuctions({ q: query, category, status });
    // จัดเรียง
    if (sortBy === "latest") {
      list = list.sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime());
    } else if (sortBy === "bid_desc") {
      list = list.sort((a, b) => b.currentBid - a.currentBid);
    } else if (sortBy === "bid_asc") {
      list = list.sort((a, b) => a.currentBid - b.currentBid);
    }
    return list;
  }, [category, query, status, sortBy]);

  const submitSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header / Breadcrumb */}
      <div className="border-b border-gray-100 bg-white/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="text-sm text-gray-600">
            <Link href="/auctions" className="hover:text-fuchsia-700">Auctions</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-gray-800">{category}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{category}</h1>
        </div>
      </div>

      {/* Controls */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-2 ring-1 ring-purple-100 md:min-w-[360px]"
            role="search"
            aria-label="Search in category"
          >
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search in ${category}`}
              className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none"
              aria-label="Search input"
            />
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 flex items-center gap-1"><Filter className="h-4 w-4" /> Filter:</span>

            <div className="flex items-center gap-1">
              {(["all", "upcoming", "live", "closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1.5 text-sm ring-1 transition ${
                    status === s
                      ? "bg-fuchsia-600 text-white ring-fuchsia-600"
                      : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
            >
              <option value="latest">Latest</option>
              <option value="bid_desc">Highest Bid</option>
              <option value="bid_asc">Lowest Bid</option>
            </select>
          </div>
        </div>

        {/* Result summary */}
        <div className="mt-2 text-sm text-gray-600">
          Showing <span className="font-semibold">{items.length}</span> items in <span className="font-semibold">{category}</span>
          {query.trim() ? <> for “<span className="font-semibold">{query.trim()}</span>”</> : null}
          {status !== "all" ? <> · Status: <span className="font-semibold">{status}</span></> : null}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((a) => {
            const st = getStatus(a);
            return (
              <Link
                key={a.slug}
                href={`/auctions/${a.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="relative">
                  <Image
                    src={a.img}
                    alt={a.titleEN}
                    width={640}
                    height={480}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    st === "live" ? "bg-emerald-100 text-emerald-700" :
                    st === "upcoming" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {st.toUpperCase()}
                  </span>
                </div>
                <div className="p-3">
                  <div className="line-clamp-1 text-sm font-semibold text-gray-900">{a.titleEN}</div>
                  <div className="mt-1 text-xs text-gray-500">{a.artist}</div>
                  <div className="mt-2 text-sm font-bold text-gray-900">{formatUSD(a.currentBid)}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Ends {new Date(a.endsAt).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back to all categories */}
        <div className="mt-8 text-center">
          <Link
            href="/auctions"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← Back to all auctions
          </Link>
        </div>
      </section>
    </main>
  );
}
