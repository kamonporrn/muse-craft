"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";
import { getUserById, listOrdersByBuyer } from "@/lib/users";

const thb = (n: number) =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const [ok, setOk] = useState(false);
  const [adminName, setAdminName] = useState("Admin01");
  useEffect(() => {
    try {
      const role = localStorage.getItem("musecraft.role");
      const name = localStorage.getItem("musecraft.userName") || "Admin01";
      setAdminName(name);
      if (role === "admin") setOk(true);
      else window.location.replace("/signin");
    } catch { window.location.replace("/signin"); }
  }, []);

  const user = getUserById(params.id);
  const orders = user ? listOrdersByBuyer(user.id) : [];
  const totalSpent = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);

  if (!ok) return <div className="grid min-h-screen place-items-center bg-[#efe2fb]">Checking permission…</div>;

  if (!user || user.role !== "Collector") {
    return (
      <div className="min-h-screen bg-[#efe2fb]">
        <AdminNavbar userName={adminName} />
        <main className="mx-auto max-w-5xl px-4 py-6">
          <p className="rounded-xl bg-white p-6 ring-1 ring-purple-100 text-gray-700">
            User not found or not a Collector.
          </p>
          <Link href="/admin/users" className="mt-4 inline-block text-purple-700 underline">Back to Users</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efe2fb]">
      <AdminNavbar userName={adminName} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">{user.name} — Account Overview</h1>

        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 ring-1 ring-purple-100">
            <div className="text-sm text-gray-600">Email</div>
            <div className="text-gray-900 font-semibold">{user.email}</div>
          </div>
          <div className="rounded-xl bg-white p-4 ring-1 ring-purple-100">
            <div className="text-sm text-gray-600">Account ID</div>
            <div className="text-gray-900 font-semibold">{user.accountId}</div>
          </div>
          <div className="rounded-xl bg-white p-4 ring-1 ring-purple-100">
            <div className="text-sm text-gray-600">Total Spent</div>
            <div className="text-gray-900 font-semibold">{thb(totalSpent)}</div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-purple-100">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="px-4 py-3 text-gray-800">{o.id}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {o.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(o.dateISO).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{thb(o.total)}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500">No purchase history.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        <Link href="/admin/users" className="mt-6 inline-block text-purple-700 underline">Back to Users</Link>
      </main>
    </div>
  );
}
