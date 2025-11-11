"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Clock, ChevronLeft, Gavel } from "lucide-react";
import CharityNavbar from "@/components/CharityNavbar";

// ---- mock loader (คุณเชื่อม lib/auctions ได้ภายหลัง) ----
type ViewItem = {
  slug: string;
  title: string;
  img: string;
  desc: string;
  fileType: string;
  onSaleISO: string;
  currentBid: number;
  totalDonate: number;
  endsAt: string; // ISO
};

const SEED: ViewItem[] = [
  {
    slug: "oceans-whisper",
    title: "Ocean’s Whisper",
    img: "/images/ocean-whisper.jpg",
    desc:
      `“Ocean’s Whisper” captures the quiet yet powerful dialogue between sea and soul. ` +
      `Gentle blue–turquoise tones evoke the horizon where water meets sky, ` +
      `with calm on the surface and depth beneath.`,
    fileType: "PNG",
    onSaleISO: "2024-08-03T09:00:00.000Z",
    currentBid: 1000,
    totalDonate: 10250,
    endsAt: new Date(Date.now() + 60_000).toISOString(), // +60s demo
  },
  {
    slug: "dreamwalker",
    title: "Dreamwalker",
    img: "/images/ocean-whisper.jpg",
    desc: "A surreal journey through memory and light.",
    fileType: "JPG",
    onSaleISO: "2024-10-12T09:00:00.000Z",
    currentBid: 249,
    totalDonate: 8450,
    endsAt: new Date(Date.now() + 3600_000).toISOString(), // +60m demo
  },
];

const RECENT_BIDS = [
  { bidder: "Liam Carter", amount: 12000, time: "2 hours ago" },
  { bidder: "Sophia Bennett", amount: 11600, time: "2 hours ago" },
  { bidder: "Ethan Walker", amount: 11200, time: "4 hours ago" },
  { bidder: "Olivia Hayes", amount: 10500, time: "5 hours ago" },
  { bidder: "Noah Foster", amount: 10000, time: "6 hours ago" },
];

function baht(n: number) {
  return n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 2 });
}
function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function diffSec(endISO: string) {
  const d = new Date(endISO).getTime() - Date.now();
  return Math.max(0, Math.floor(d / 1000));
}

export default function AuctionViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  // guard: เฉพาะ role=charity (เดโม่; ผูกจริงภายหลัง)
  useEffect(() => {
    const role = localStorage.getItem("musecraft.role");
    if (role !== "charity") router.replace("/signin");
  }, [router]);

  const item = useMemo(
    () => SEED.find((x) => x.slug === slug) ?? SEED[0],
    [slug]
  );

  const [left, setLeft] = useState<number>(() => diffSec(item.endsAt));
  useEffect(() => {
    const t = setInterval(() => setLeft(diffSec(item.endsAt)), 1000);
    return () => clearInterval(t);
  }, [item.endsAt]);

  const d = Math.floor(left / 86400);
  const h = Math.floor((left % 86400) / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <CharityNavbar logoSrc="/logo-charity.png" />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        {/* Title + countdown */}
        <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-rose-600">
            <Clock className="h-5 w-5" />
            {d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)} s`}
          </div>
        </header>

        {/* Content grid */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
              <Image
                src={item.img}
                alt={item.title}
                width={1600}
                height={1200}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            {/* Description */}
            <article className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-base font-semibold text-gray-800">Description</h2>
              <p className="leading-relaxed text-gray-700">{item.desc}</p>
            </article>
          </div>

          {/* Right column: facts + KPIs + table */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Quick facts */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Details</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-gray-600">Type</dt>
                <dd className="font-medium text-gray-900">{item.fileType}</dd>

                <dt className="text-gray-600">On Sale</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(item.onSaleISO).toLocaleDateString("en-GB")}
                </dd>
              </dl>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-purple-100 bg-white p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500">Current Bid</div>
                <div className="mt-1 text-2xl font-extrabold tabular-nums">{baht(item.currentBid)}</div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm">
                <div className="text-xs font-medium text-gray-500">Current Donate</div>
                <div className="mt-1 text-2xl font-extrabold tabular-nums">
                  {item.totalDonate.toLocaleString("th-TH")}
                </div>
              </div>
            </div>

            {/* Recent bids */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Gavel className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-800">Recent Bids</h3>
              </div>

              <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Bidder</th>
                      <th className="px-4 py-2 text-left font-medium">Amount</th>
                      <th className="px-4 py-2 text-left font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {RECENT_BIDS.map((b, i) => (
                      <tr key={i} className="bg-white">
                        <td className="px-4 py-3">{b.bidder}</td>
                        <td className="px-4 py-3 tabular-nums text-purple-700">
                          {baht(b.amount)}
                        </td>
                        <td className="px-4 py-3 text-purple-700">{b.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Back button (bottom for mobile) */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
