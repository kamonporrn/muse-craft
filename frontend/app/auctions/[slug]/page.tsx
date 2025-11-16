"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { useParams, notFound } from "next/navigation";
import { getAuctionBySlug } from "@/lib/auctions";

function formatUSD(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex h-16 w-24 flex-col items-center justify-center rounded-xl bg-purple-50 text-gray-800 ring-1 ring-purple-100">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[11px] text-gray-500">{label}</div>
    </div>
  );
}

type Bid = { bidder: string; amount: number; time: string };

export default function AuctionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const artwork = getAuctionBySlug(slug as string);
  if (!artwork) return notFound();
  
  // demo countdown (1d 12:30:15)
  const endsAt = useMemo(
    () => new Date(Date.now() + 1 * 864e5 + 12 * 36e5 + 30 * 6e4 + 15 * 1e3),
    []
  );
  const [remaining, setRemaining] = useState(endsAt.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(
      () => setRemaining(Math.max(0, endsAt.getTime() - Date.now())),
      1000
    );
    return () => clearInterval(t);
  }, [endsAt]);
  const d = Math.floor(remaining / 864e5);
  const h = Math.floor((remaining % 864e5) / 36e5);
  const m = Math.floor((remaining % 36e5) / 6e4);
  const s = Math.floor((remaining % 6e4) / 1e3);
  const isEnded = remaining <= 0;

  const [bids, setBids] = useState<Bid[]>([
    { bidder: "Liam Carter", amount: 12000, time: "2 hours ago" },
    { bidder: "Sophia Bennett", amount: 11500, time: "3 hours ago" },
    { bidder: "Ethan Walker", amount: 11200, time: "4 hours ago" },
    { bidder: "Olivia Hayes", amount: 10750, time: "5 hours ago" },
    { bidder: "Noah Foster", amount: 9800, time: "6 hours ago" },
  ]);

  const highest = Math.max(artwork.currentBid, ...bids.map((b) => b.amount));
  const nextMin = highest + 100;

  const [myBid, setMyBid] = useState("");

  const placeBid = useCallback(() => {
    if (isEnded) return;
    const value = Number(myBid.replace(/[^0-9.]/g, ""));
    if (!value || value <= highest) {
      alert(`Please enter more than ${formatUSD(highest)} (min ${formatUSD(nextMin)}).`);
      return;
    }
    setBids((prev) => [
      { bidder: "You", amount: value, time: "just now" },
      ...prev,
    ]);
    setMyBid("");
  }, [isEnded, myBid, highest, nextMin]);

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      placeBid();
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top mini navbar with logo */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="MuseCraft" width={40} height={40} />
            <span className="text-sm font-semibold text-gray-800">MuseCraft</span>
          </Link>
          <div className="text-xs text-gray-500">Auction • {slug}</div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white/80">
        <div className="mx-auto max-w-5xl px-4 py-3 text-sm text-gray-600">
          <nav className="flex items-center gap-1">
            <Link href="/" className="hover:text-fuchsia-700">
              Collectibles
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/#categories" className="hover:text-fuchsia-700">
              {artwork.category}
            </Link>
          </nav>
        </div>
      </div>

      {/* Body */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {artwork.titleEN}{" "}
          <span className="text-gray-500 text-base">{artwork.titleTH}</span>
        </h1>

        <div className="mt-4 w-full overflow-hidden rounded-xl ring-1 ring-black/5">
          <Image
            src={artwork.img}
            alt={artwork.titleEN}
            width={1200}
            height={800}
            className="mx-auto h-[520px] w-auto object-cover"
            priority
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* left: details */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Auction Details
            </h3>
            <p className="text-sm leading-6 text-gray-700">
              A serene portrayal of nature’s tranquility,{" "}
              <em>{artwork.titleEN}</em> captures a hidden waterfall cascading
              gently over moss-covered rocks, surrounded by lush greenery
              bathed in soft morning light. The artist skillfully contrasts
              light and shadow, creating an atmosphere of calm introspection —
              where time seems to pause amid the whispers of water and leaves.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              <li>
                <span className="font-medium">Medium:</span> {artwork.medium}
              </li>
              <li>
                <span className="font-medium">Size:</span> {artwork.size}
              </li>
              <li>
                <span className="font-medium">Signed:</span> {artwork.artist}
              </li>
            </ul>
          </div>

          {/* right: bidding */}
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">
              Current Bid
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatUSD(highest)}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Minimum next bid: <span className="font-semibold">{formatUSD(nextMin)}</span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <StatBox label="Days" value={d} />
              <StatBox label="Hours" value={h} />
              <StatBox label="Minutes" value={m} />
              <StatBox label="Seconds" value={s} />
              <Clock className="ml-1 hidden h-5 w-5 text-gray-400 md:block" />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <input
                value={myBid}
                onChange={(e) => setMyBid(e.target.value)}
                onKeyDown={onEnter}
                placeholder={`Enter ≥ ${formatUSD(nextMin)}`}
                inputMode="decimal"
                className="w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-500 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 disabled:bg-gray-50"
                disabled={isEnded}
                aria-label="Your bid"
              />
              <button
                onClick={placeBid}
                disabled={isEnded}
                className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isEnded ? "Auction Ended" : "Place Bid"}
              </button>
            </div>
          </div>
        </div>

        {/* bids table */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-700">Recent Bids</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Bidder</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {bids.map((b, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-gray-800">{b.bidder}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatUSD(b.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* helper when ended */}
          {isEnded && (
            <div className="mt-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800 ring-1 ring-yellow-100">
              The auction has ended. You can browse similar items in{" "}
              <Link
                href="/#categories"
                className="font-medium underline underline-offset-2"
              >
                {artwork.category}
              </Link>
              .
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
