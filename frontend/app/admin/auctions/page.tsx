"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import {
  listAuctions,
  type Auction,
  getStatus,
} from "@/lib/auctions";

const thb = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

function useCountdown(targetISO: string) {
  const target = new Date(targetISO);
  const [remain, setRemain] = useState(() => Math.max(0, target.getTime() - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setRemain(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [targetISO]);
  const d = Math.floor(remain / 86400000);
  const h = Math.floor((remain % 86400000) / 3600000);
  const m = Math.floor((remain % 3600000) / 60000);
  const s = Math.floor((remain % 60000) / 1000);
  return { d, h, m, s, finished: remain <= 0 };
}

function CountDownText({ endsAt }: { endsAt: string }) {
  const { d, h, m, s, finished } = useCountdown(endsAt);
  if (finished) return <span className="text-red-600 font-semibold">00 : 00 : 00</span>;
  return (
    <span className="tabular-nums font-semibold text-purple-700">
      {d > 0 ? `${d}d ` : ""}
      {String(h).padStart(2, "0")} : {String(m).padStart(2, "0")} : {String(s).padStart(2, "0")}
    </span>
  );
}

function ActiveCard({ a }: { a: Auction }) {
  return (
    <article className="flex w-[260px] flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5">
      <div className="overflow-hidden rounded-t-2xl">
        <Image
          src={a.img}
          alt={a.titleEN}
          width={520}
          height={520}
          className="h-48 w-full object-cover"
        />
      </div>

      <div className="space-y-2 p-3">
        <div className="text-sm font-semibold text-gray-900 line-clamp-1">{a.titleEN}</div>
        <div className="text-[12px] text-gray-500">By {a.artist}</div>

        <div className="grid grid-cols-2 gap-3 pt-2 text-[12px]">
          <div className="text-gray-600">
            <div>Current Bid</div>
            <div className="font-semibold text-gray-800">{thb(a.currentBid)}</div>
          </div>
          <div className="text-gray-600">
            <div>Category</div>
            <div className="font-semibold text-gray-800">{a.category}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[12px] text-gray-500">
            <CountDownText endsAt={a.endsAt} />
          </div>
          <Link
            href={`/auctions/${a.slug}`}
            className="rounded-full bg-fuchsia-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-fuchsia-700"
          >
            More details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AdminAuctionsPage() {
  // guard admin
  const [ok, setOk] = useState(false);
  const [userName, setUserName] = useState("Admin01");
  useEffect(() => {
    try {
      const role = localStorage.getItem("musecraft.role");
      const name = localStorage.getItem("musecraft.userName") || "Admin01";
      setUserName(name);
      if (role === "admin") setOk(true);
      else window.location.replace("/signin");
    } catch {
      window.location.replace("/signin");
    }
  }, []);

  const [rows, setRows] = useState<Auction[]>([]);
  useEffect(() => {
    setRows(listAuctions()); // ← ดึงจาก lib/auctions.ts
  }, []);

  const { active, closed } = useMemo(() => {
    const active = rows.filter(a => getStatus(a) === "live");
    const closed = rows.filter(a => getStatus(a) === "closed")
      .sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime());
    return { active, closed };
  }, [rows]);

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#efe2fb] text-gray-700">
        Checking permission…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efe2fb]">
      <AdminNavbar userName={userName} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Auction Tracking</h1>

        {/* live */}
        <section className="mt-4">
          <h2 className="text-sm font-semibold text-gray-700">Currently under auction</h2>
          {active.length ? (
            <div className="mt-3 flex flex-wrap gap-5">
              {active.map(a => <ActiveCard key={a.slug} a={a} />)}
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-white p-6 text-center text-gray-500 ring-1 ring-purple-100">
              No active auctions.
            </div>
          )}
        </section>

        {/* closed */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-gray-700">Closed</h2>
          <div className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-purple-100">
            <table className="min-w-full text-sm">
              <thead className="bg-purple-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name Artwork</th>
                  <th className="px-4 py-3 text-left">Closing price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Closing date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {closed.map((a) => (
                  <tr key={a.slug} className="align-top">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={a.img}
                          alt={a.titleEN}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover ring-1 ring-black/5"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{a.titleEN}</div>
                          <div className="text-[12px] text-gray-500">By {a.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {thb(a.currentBid)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">Auction closed</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(a.endsAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/auctions/${a.slug}`}
                        className="rounded-full bg-fuchsia-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-fuchsia-700"
                      >
                        More details
                      </Link>
                    </td>
                  </tr>
                ))}
                {!closed.length && (
                  <tr>
                    <td className="px-4 py-5 text-center text-gray-500" colSpan={5}>
                      No closed auctions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
