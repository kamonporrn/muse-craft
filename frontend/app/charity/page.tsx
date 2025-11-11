// app/charity/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { Clock, Gavel, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CharityNavbar from "@/components/CharityNavbar";
import { routeModule } from "next/dist/build/templates/app-page";
import { Router } from "next/router";

/** ---------- Types ---------- */
type AuctionRow = {
  id: string;            // ใช้เป็น slug ด้วย
  title: string;
  img: string;
  currentBid: number;
  bidCount: number;
  endsInSec: number;     // demo countdown (seconds)
  status: "active" | "waiting";
};

/** ---------- Helpers ---------- */
function baht(n: number) {
  return n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 2 });
}
function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CharityDashboard() {
  const router = useRouter();

  // ===== Guard: ต้องเป็น charity เท่านั้น =====
  const [ok, setOk] = useState(false);
  const [userName, setUserName] = useState("Charity");
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      const role = localStorage.getItem("musecraft.role");
      const name = localStorage.getItem("musecraft.userName") || "Charity";
      setUserName(name);
      if (role === "charity") setOk(true);
      else router.replace("/signin");
    } catch {
      router.replace("/signin");
    }
  }, [router]);

  // ===== Mock data =====
  const [rows, setRows] = useState<AuctionRow[]>([
    { id: "oceans-whisper", title: "Ocean’s Whisper", img: "/images/ocean-whisper.jpg", currentBid: 1000, bidCount: 20, endsInSec: 59, status: "active" },
    { id: "dreamwalker",     title: "Dreamwalker",     img: "/images/ocean-whisper.jpg", currentBid: 249,  bidCount: 20, endsInSec: 3600, status: "waiting" },
  ]);

  // ===== Global search =====
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter(r => r.title.toLowerCase().includes(qq));
  }, [rows, q]);

  // ===== Countdown tick =====
  useEffect(() => {
    const t = setInterval(() => {
      setRows(prev =>
        prev.map(r =>
          r.endsInSec > 0 ? { ...r, endsInSec: r.endsInSec - 1 } : r
        )
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ===== Actions =====
  const onAccept = useCallback((id: string) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status: "active" } : r)));
  }, []);

  const onDelete = useCallback((id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  }, []);

  const onCreateAuction = useCallback(() => {
    router.push("/charity/create");
  }, [router]);

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-white text-gray-700">
        Checking permission…
      </div>
    );
  }

  // split sections
  const activeRows = filtered.filter(r => r.status === "active");
  const waitingRows = filtered.filter(r => r.status === "waiting");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ใช้ Navbar เฉพาะ Charity (มีโลโก้,signout กลับ Home) */}
      <CharityNavbar logoSrc="/logo-charity.png" />

      {/* ---------- Stats ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Bid" value="100,000" />
          <StatCard label="Total Donat" value="103,124" />
          <StatCard label="Active" value={String(activeRows.length)} />
        </div>
        </section>

      {/* Divider */}
      <div className="mx-auto mt-6 max-w-6xl px-4">
        <hr className="border-t-4 border-purple-500/70" />
      </div>

      {/* ---------- Products / Auctions (Active) ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Auction Pending</h2>
          <div className="hidden items-center gap-8 md:flex">
            <span className="w-28 text-sm text-gray-600">Current Bid</span>
            <span className="w-16 text-sm text-gray-600">Bid</span>
            <span className="w-36 text-sm text-gray-600">Time left</span>
            <span className="w-24 text-sm text-gray-600">Status</span>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {activeRows.map((r) => (
            <RowCard
              key={r.id}
              row={r}
              onView={() => router.push(`/auctions/${encodeURIComponent(r.id)}`)}
            />
          ))}
          {activeRows.length === 0 && <EmptyLine text="No active auctions." />}
        </div>

        <button
          onClick={onCreateAuction}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
        >
          <Plus className="h-5 w-5" />
          Create New Auction
        </button>
      </section>

      {/* Divider */}
      <div className="mx-auto mt-6 max-w-6xl px-4">
        <hr className="border-t-4 border-purple-500/70" />
      </div>

      {/* ---------- Requests (Waiting) ---------- */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-12">
        <h2 className="text-lg font-bold">Request</h2>

        <div className="mt-3 space-y-3">
          {waitingRows.map((r) => (
            <RowCard
              key={r.id}
              row={r}
              onAccept={() => onAccept(r.id)}
              onDelete={() => onDelete(r.id)}
              showModeration
            />
          ))}
          {waitingRows.length === 0 && <EmptyLine text="No pending requests." />}
        </div>
      </section>
    </div>
  );
}

/** ---------- Small components ---------- */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-4 text-center shadow-sm">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: "active" | "waiting" }) {
  if (status === "active") {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
        active
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
      waiting
    </span>
  );
}

function RowCard({
  row,
  onView,
  onAccept,
  onDelete,
  showModeration = false,
}: {
  row: AuctionRow;
  onView?: () => void;
  onAccept?: () => void;
  onDelete?: () => void;
  showModeration?: boolean;
}) {
  const d = Math.floor(row.endsInSec / 86400);
  const h = Math.floor((row.endsInSec % 86400) / 3600);
  const m = Math.floor((row.endsInSec % 3600) / 60);
  const s = Math.floor(row.endsInSec % 60);

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
      {/* Image + title */}
      <div className="flex min-w-0 flex-[2] items-center gap-3">
        <div className="overflow-hidden rounded-lg ring-1 ring-black/5">
          <Image
            src={row.img}
            alt={row.title}
            width={64}
            height={64}
            className="h-16 w-16 object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">{row.title}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <Gavel className="h-3.5 w-3.5" />
            Auction item
          </div>
        </div>
      </div>

      {/* Right columns */}
      <div className="hidden flex-1 items-center justify-between md:flex">
        <div className="w-28 text-center text-sm font-semibold text-gray-800">{baht(row.currentBid)}</div>
        <div className="w-16 text-center text-sm text-gray-700">{row.bidCount}</div>
        <div className="w-36 text-center text-sm text-gray-700 inline-flex items-center justify-center gap-1">
          <Clock className="h-4 w-4 text-gray-500" />
          {d > 0 ? `${d}d ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)} s`}
        </div>
        <div className="w-24 text-center">
          <StatusPill status={row.status} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pl-3">
        <button
          onClick={onView}
          className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          View
        </button>

        {showModeration && (
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <button
              onClick={onAccept}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Accept
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-600">
      {text}
    </div>
  );
}
