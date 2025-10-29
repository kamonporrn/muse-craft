"use client";

import Image from "next/image";
import {
  LayoutGrid, Package, Gavel, BarChart2, Settings, Plus, MoreHorizontal,
} from "lucide-react";
import { useMemo } from "react";

export default function SellerDashboardPage() {
  // --- demo data ---
  const kpis = [
    { title: "Total Revenue", value: "$12,450", delta: "+12.5%", up: true },
    { title: "Artworks Sold", value: "32", delta: "+5.2%", up: true },
    { title: "Active Auctions", value: "5", delta: "-2.1%", up: false },
    { title: "Pending Orders", value: "3", delta: "+8.0%", up: true },
  ];

  type OrderStatus = {
    label: string;
    tone: "emerald" | "indigo" | "rose" | "gray";
  };

  const orders: Array<{
    img: string;
    name: string;
    by: string;
    id: string;
    date: string;
    customer?: string;
    status: OrderStatus;
    amount: string;
  }> = [
    {
      img: "/demo-art-1.jpg",
      name: "Golden Hour",
      by: "Olivia Chen",
      id: "#A5D8B1",
      date: "Oct 12, 2023",
      status: { label: "Shipped", tone: "emerald" } as OrderStatus,
      amount: "$350.00",
    },
    {
      img: "/demo-art-2.jpg",
      name: "Midnight Bloom",
      by: "Sofia Rossi",
      id: "#C9E4F7",
      date: "Oct 11, 2023",
      status: { label: "Processing", tone: "indigo" },
      amount: "$720.00",
    },
    {
      img: "/demo-art-3.jpg",
      name: "Bronze Contemplation",
      by: "Marcus Aurelius",
      id: "#F2B8A2",
      date: "Oct 09, 2023",
      customer: "Noah Brown",
      status: { label: "Cancelled", tone: "rose" },
      amount: "$1,200.00",
    },
  ];

  // simple sparkline points
  const linePoints = useMemo(() => {
    const pts = [24, 52, 38, 60, 48, 90, 28, 20, 75, 22, 18, 80];
    const w = 720, h = 140, pad = 8;
    const max = Math.max(...pts), min = Math.min(...pts);
    const nx = (i: number) => pad + (i * (w - pad * 2)) / (pts.length - 1);
    const ny = (v: number) =>
      h - pad - ((v - min) * (h - pad * 2)) / (max - min || 1);
    return pts.map((v, i) => `${nx(i)},${ny(v)}`).join(" ");
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-gray-100 bg-gradient-to-b from-purple-50 to-white">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 text-white">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Artisan Gallery</div>
              <div className="text-xs text-gray-500">Seller Dashboard</div>
            </div>
          </div>

          <nav className="mt-2 space-y-1 px-3">
            <NavItem icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" active />
            <NavItem icon={<Package className="h-4 w-4" />} label="Products" />
            <NavItem icon={<Gavel className="h-4 w-4" />} label="Auctions" />
            <NavItem icon={<BarChart2 className="h-4 w-4" />} label="Sales" />
            <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
          </nav>

          <div className="mt-6 px-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700">
              <Plus className="h-4 w-4" />
              Add New Artwork
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="px-5 py-6 md:px-8">
          <header>
            <h1 className="text-2xl font-bold">Welcome back, Artisan Gallery</h1>
            <p className="mt-1 text-sm text-gray-500">
              Here’s a summary of your shop’s performance.
            </p>
          </header>

          {/* KPI cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <div
                key={k.title}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="text-sm text-gray-600">{k.title}</div>
                <div className="mt-1 text-2xl font-bold">{k.value}</div>
                <div
                  className={`mt-1 text-xs font-medium ${
                    k.up ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {k.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Sales Performance */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-end justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-700">Sales Performance</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">$4,820</div>
                  <span className="text-xs font-medium text-emerald-600">+15.2%</span>
                </div>
                <div className="text-xs text-gray-500">Last 30 Days</div>
              </div>
              <div className="text-xs text-gray-500">Week 1 – Week 4</div>
            </div>

            {/* simple SVG line chart in purple */}
            <div className="mt-2 rounded-lg bg-purple-50/60 p-3 ring-1 ring-purple-100">
              <svg viewBox="0 0 720 140" className="h-40 w-full">
                <polyline
                  fill="none"
                  stroke="rgb(147 51 234)" /* purple-600 */
                  strokeWidth="3"
                  points={linePoints}
                />
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(147,51,234,0.25)" />
                  <stop offset="100%" stopColor="rgba(147,51,234,0.02)" />
                </linearGradient>
                <polygon
                  points={`${linePoints} 720,140 0,140`}
                  fill="url(#fillGradient)"
                />
              </svg>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Recent Orders</h2>

            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="text-xs text-gray-500">
                  <tr className="border-b border-gray-100">
                    <th className="px-3 py-2">Artwork</th>
                    <th className="px-3 py-2">Order ID</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-100">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{o.name}</div>
                            <div className="text-xs text-gray-500">By {o.by}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{o.id}</td>
                      <td className="px-3 py-3 text-gray-700">{o.date}</td>
                      <td className="px-3 py-3 text-gray-700">{o.customer}</td>
                      <td className="px-3 py-3">
                        <StatusPill tone={o.status.tone}>{o.status.label}</StatusPill>
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-900">{o.amount}</td>
                      <td className="px-3 py-3 text-right">
                        <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- components ---------------- */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm ${
        active
          ? "bg-purple-100 text-purple-800"
          : "text-gray-700 hover:bg-purple-50"
      }`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-md ${
          active ? "bg-white text-purple-700 ring-1 ring-purple-200" : "bg-white text-gray-600 ring-1 ring-gray-200"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatusPill({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "indigo" | "rose" | "gray";
}) {
  const map: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    indigo: "bg-indigo-100 text-indigo-700",
    rose: "bg-rose-100 text-rose-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[tone] || map.gray}`}>
      {children}
    </span>
  );
}
