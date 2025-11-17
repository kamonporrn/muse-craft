// app/admin/users/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

// ดึง type + ฟังก์ชันจาก lib/users
import {
  User,
  Role,
  Status,
  getUsers,
  suspendUser,
  restoreUser,
  deleteUserSoft,
} from "@/lib/users";

/* ---------- Helpers ---------- */
const badge = (status: Status) => {
  if (status === "Normal")
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "Suspended")
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  return "bg-gray-50 text-gray-500 ring-1 ring-gray-200";
};

// filter role ใช้เฉพาะ Creator / Collector / Admin (ตัด Charity ออก)
type RoleFilter = "All" | "Creator" | "Collector" | "Admin";

export default function AdminUsersPage() {
  // ===== Guard: admin เท่านั้น =====
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

  // users จาก lib/users แต่ *ไม่เอา Charity มาโชว์ในหน้านี้*
  const [rows, setRows] = useState<User[]>([]);

  useEffect(() => {
  if (!ok) return;               // รอให้ guard เช็คเสร็จก่อน
  const list = getUsers();       // ดึงทุก user จาก lib/users
  setRows(list);
}, [ok]);

  /* --------- Filters & search --------- */
  const [q, setQ] = useState("");
  const [fRole, setFRole] = useState<RoleFilter>("All");
  const [fStatus, setFStatus] = useState<"All" | Status>("All");

  /* --------- Pagination --------- */
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useMemo(() => {
    const data = rows.filter((r) => {
      if (fRole !== "All" && r.role !== fRole) return false;
      if (fStatus !== "All" && r.status !== fStatus) return false;
      if (q) {
        const key = (r.name + " " + r.email + " " + r.accountId).toLowerCase();
        if (!key.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    return data;
  }, [rows, fRole, fStatus, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* --------- Actions (เชื่อมกับ lib/users/mutations.ts) --------- */
  const toggleSuspend = (id: string) => {
    setRows((prev) => {
      const user = prev.find((u) => u.id === id);
      if (!user) return prev;

      if (user.status === "Suspended") {
        restoreUser(id); // อัปเดตใน localStorage
        return prev.map((u) =>
          u.id === id ? { ...u, status: "Normal" } : u
        );
      } else {
        suspendUser(id);
        return prev.map((u) =>
          u.id === id ? { ...u, status: "Suspended" } : u
        );
      }
    });
  };

  const deleteAccount = (id: string) => {
    deleteUserSoft(id); // อัปเดตใน localStorage
    setRows((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Deleted" } : u))
    );
  };

  // ปุ่มหลักตามบทบาท — ไม่มี Charity แล้ว
  const primaryAction = (u: User) => {
    switch (u.role) {
      case "Creator":
        return { href: `/admin/users/${u.id}/artworks`, label: "View Artworks" };
      case "Collector":
        return { href: `/admin/users/${u.id}`, label: "View Account" };
      case "Admin":
        return { href: `/admin/users/${u.id}/log`, label: "View Log" };
      default:
        return { href: `/admin/users/${u.id}`, label: "View" };
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>

        {/* Filters */}
        <section className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-purple-100 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {/* Role */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">
                Roles of Users
              </div>
              <select
                value={fRole}
                onChange={(e) => {
                  setPage(1);
                  setFRole(e.target.value as RoleFilter);
                }}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-400 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Creator">Creator</option>
                <option value="Collector">Collector</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">
                Status
              </div>
              <select
                value={fStatus}
                onChange={(e) => {
                  setPage(1);
                  setFStatus(e.target.value as any);
                }}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-400 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="Normal">Normal</option>
                <option value="Suspended">Suspended</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <div className="mb-1 text-sm font-semibold text-gray-700">
                Search
              </div>
              <div className="flex items-center rounded-full border border-gray-200 bg-white px-3 py-2.5 focus-within:border-purple-400">
                <Search className="mr-2 h-4 w-4 text-purple-600" />
                <input
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  placeholder="Search by name, email or account ID…"
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mt-5 overflow-hidden rounded-2xl bg-white ring-1 ring-purple-100 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Users</th>
                <th className="px-4 py-3 text-left">Account ID</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {current.map((u) => {
                const pa = primaryAction(u);
                return (
                  <tr key={u.id} className="hover:bg-purple-50/40">
                    {/* User cell */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/5">
                          <Image
                            src={u.avatar || "/avatar-placeholder.png"}
                            alt={u.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {u.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {u.accountId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Primary view */}
                        <Link
                          href={pa.href}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                        >
                          {pa.label}
                        </Link>

                        {/* Suspend / Unsuspend */}
                        <button
                          onClick={() => toggleSuspend(u.id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            u.status === "Suspended"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          }`}
                        >
                          {u.status === "Suspended" ? "Unsuspend" : "Suspend"}
                        </button>

                        {/* Delete Account: โชว์เฉพาะตอน Suspended */}
                        {u.status === "Suspended" && (
                          <button
                            onClick={() => deleteAccount(u.id)}
                            className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                          >
                            Delete Account
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-gray-600"
                  >
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer: pagination */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
            <div>
              Showing{" "}
              <span className="font-medium">
                {filtered.length === 0
                  ? 0
                  : (page - 1) * PAGE_SIZE + 1}
                –
                {Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-medium">{filtered.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-full bg-white px-4 py-1.5 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="rounded-full bg-white px-4 py-1.5 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
