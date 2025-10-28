// app/coupons/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { TicketPercent, Truck, CheckCircle2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

// ---- Types
type Coupon = {
  id: string;
  title: string;            // e.g. "50% Discount, Max 500 THB"
  minSpend?: number;        // THB
  maxDiscount?: number;     // THB
  type: "percent" | "freeship";
  percent?: number;         // when percent type
  code?: string;            // for MuseCraft Code
  tag?: "MuseCraft Code";
  expiresAt: string;        // ISO date string
};

// ---- Mock data
const COUPONS: Coupon[] = [
  {
    id: "c1",
    title: "50% Discount, Max 500 THB",
    minSpend: 200,
    maxDiscount: 500,
    type: "percent",
    percent: 50,
    code: "MUSE50",
    tag: "MuseCraft Code",
    expiresAt: addDays(1),
  },
  {
    id: "c2",
    title: "35% Discount, Max 450 THB",
    minSpend: 300,
    maxDiscount: 450,
    type: "percent",
    percent: 35,
    code: "MUSE35",
    tag: "MuseCraft Code",
    expiresAt: addDays(1),
  },
  {
    id: "c3",
    title: "30% Discount, Max 100 THB",
    minSpend: 75,
    maxDiscount: 100,
    type: "percent",
    percent: 30,
    code: "SAVE30",
    tag: "MuseCraft Code",
    expiresAt: addDays(3),
  },
  {
    id: "c4",
    title: "15% Discount, Max 50 THB",
    minSpend: 0,
    maxDiscount: 50,
    type: "percent",
    percent: 15,
    code: "WELCOME15",
    tag: "MuseCraft Code",
    expiresAt: addDays(30),
  },
  {
    id: "c5",
    title: "Free Shipping, Up to 100 THB",
    minSpend: 300,
    maxDiscount: 100,
    type: "freeship",
    expiresAt: addDays(60),
  },
];

// ---- Helpers
function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
function daysLeft(iso: string) {
  const now = new Date();
  const end = new Date(iso);
  const ms = end.getTime() - now.getTime();
  const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return d;
}

export default function CouponsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [redeem, setRedeem] = useState("");
  const [tab, setTab] = useState<"all" | "muse">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = COUPONS.slice();
    if (tab === "muse") list = list.filter((c) => c.tag === "MuseCraft Code");
    if (redeem.trim()) {
      // optional: live filter by code box
      const q = redeem.trim().toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || (c.code || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [tab, redeem]);

  return (
    <main className="min-h-screen bg-[#f3e8ff] text-gray-900">
      {/* Top navbar (signed-in) */}
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) => router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")}
        user={{ name: "Somchai", avatarUrl: "/avatar-placeholder.png" }}
        cartCount="10+"
      />

      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar (same structure as Account) */}
        <aside className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-lg mb-3">Manage My Account</h3>
          <nav className="space-y-1">
            <Link href="/account" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Profile
            </Link>
            <Link href="/account/address" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              Address Book
            </Link>
            <Link href="/account/payments" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Payment Options
            </Link>
          </nav>

          <h3 className="font-bold text-lg mt-5 mb-3">Manage My Order</h3>
          <nav className="space-y-1">
            <Link href="/orders" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Order
            </Link>
            <Link href="/cart" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Cart
            </Link>
            <Link href="/wishlist" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Wishlist
            </Link>
            <Link
              href="/coupons"
              className="block rounded-md px-3 py-2 bg-purple-50 text-purple-700 font-medium"
            >
              Coupons
            </Link>
          </nav>
        </aside>

        {/* Main coupons area */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-3xl font-extrabold mb-6">Coupon</h1>

          {/* Redeem bar */}
          <div className="rounded-xl bg-purple-50/70 border border-purple-100 p-4 mb-5 flex flex-col sm:flex-row gap-3 items-center">
            <div className="font-semibold">Add Coupon</div>
            <input
              value={redeem}
              onChange={(e) => setRedeem(e.target.value)}
              placeholder="Enter discount coupon"
              className="flex-1 rounded-full bg-white border border-gray-200 px-4 py-2 outline-none focus:ring-4 focus:ring-purple-200"
            />
            <button
              className="rounded-full bg-purple-600 text-white px-5 py-2 font-semibold hover:bg-purple-700 transition"
              onClick={() => {
                // DEMO redeem: just clear and toast (alert) — replace with real API
                if (!redeem.trim()) return;
                alert(`Coupon "${redeem.trim()}" redeemed!`);
                setRedeem("");
              }}
            >
              Redeem
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-3 mb-4">
            <button
              className={`px-3 py-1.5 rounded-full border transition ${
                tab === "all"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setTab("all")}
            >
              All ({COUPONS.length})
            </button>
            <button
              className={`px-3 py-1.5 rounded-full border transition ${
                tab === "muse"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setTab("muse")}
            >
              MuseCraft Code ({COUPONS.filter((c) => c.tag === "MuseCraft Code").length})
            </button>
          </div>

          <hr className="mb-4" />

          {/* Coupon list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((c) => {
              const left = daysLeft(c.expiresAt);
              const isExpSoon = left <= 1;
              const Icon = c.type === "freeship" ? Truck : TicketPercent;

              return (
                <article
                  key={c.id}
                  className="flex items-stretch gap-3 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition"
                >
                  {/* left icon card */}
                  <div className="grid place-items-center w-28 rounded-l-xl bg-purple-50">
                    <Icon className="w-10 h-10 text-purple-600" />
                  </div>

                  {/* body */}
                  <div className="flex-1 py-3 pr-3">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-600">
                      {c.type === "freeship" ? (
                        <>
                          Minimum purchase {c.minSpend ?? 0} THB
                        </>
                      ) : (
                        <>
                          Minimum purchase {c.minSpend ?? 0} THB
                          {typeof c.maxDiscount === "number" ? ` • Max ${c.maxDiscount} THB` : ""}
                        </>
                      )}
                    </div>

                    <div
                      className={`mt-2 text-xs ${
                        isExpSoon ? "text-rose-600" : "text-gray-600"
                      }`}
                    >
                      {left <= 0
                        ? "Expired"
                        : left === 1
                        ? "Valid for 1 more day"
                        : `Valid for ${left} more days`}
                    </div>

                    {/* footer actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {c.code && (
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50"
                          onClick={async () => {
                            await navigator.clipboard.writeText(c.code!);
                            setCopiedId(c.id);
                            setTimeout(() => setCopiedId(null), 1200);
                          }}
                          title="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === c.id ? "Copied!" : c.code}
                        </button>
                      )}

                      <Link
                        href="/cart"
                        className="inline-flex items-center gap-1 rounded-full bg-purple-600 text-white px-3 py-1 text-sm font-semibold hover:bg-purple-700"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Use Now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
