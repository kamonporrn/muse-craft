// app/admin/users/[id]/artworks/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";
import { getUserById, listArtworksByCreator } from "@/lib/users";
import { toSlug } from "@/lib/products";

export default function CreatorArtworksPage({
  params,
}: {
  params: { id: string };
}) {
  // ===== Guard & admin profile =====
  const [ok, setOk] = useState(false);
  const [adminName, setAdminName] = useState("Admin01");

  useEffect(() => {
    try {
      const role = localStorage.getItem("musecraft.role");
      const name =
        localStorage.getItem("musecraft.userName") || "Admin01";
      setAdminName(name);
      if (role === "admin") setOk(true);
      else window.location.replace("/signin");
    } catch {
      window.location.replace("/signin");
    }
  }, []);

  const user = getUserById(params.id);
  // ผูกกับ products จริงผ่าน listArtworksByCreator (author = Creator name)
  const items = user ? listArtworksByCreator(user.name) : [];

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#efe2fb]">
        Checking permission…
      </div>
    );
  }

  // เฉพาะ Creator เท่านั้น
  if (!user || user.role !== "Creator") {
    return (
      <div className="min-h-screen bg-[#efe2fb]">
        <AdminNavbar userName={adminName} />
        <main className="mx-auto max-w-5xl px-4 py-6">
          <p className="rounded-xl bg-white p-6 text-gray-700 ring-1 ring-purple-100">
            User not found or not a Creator.
          </p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-purple-700 underline"
          >
            Back to Users
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efe2fb]">
      <AdminNavbar userName={adminName} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Artworks by {user.name}
        </h1>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {items.map((p) => {
            // ใช้ slug จากชื่อ (ให้ตรงกับหน้า /product/[slug])
            const slug = p.id ? p.id : toSlug(p.name);

            return (
              <Link
                key={slug}
                href={`/product/${slug}`}
                className="rounded-xl bg-white p-3 ring-1 ring-purple-100 shadow-sm hover:shadow-md transition"
              >
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={800}
                    height={600}
                    className="h-44 w-full object-cover"
                  />
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-800">
                  {p.name}
                </div>
                <div className="text-xs text-gray-500">{p.category}</div>
                <div className="mt-1 text-sm font-bold text-gray-900">
                  {p.price.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                    maximumFractionDigits: 0,
                  })}
                </div>
              </Link>
            );
          })}

          {!items.length && (
            <div className="col-span-full rounded-xl bg-white p-6 text-center text-gray-600 ring-1 ring-purple-100">
              No artworks from this creator.
            </div>
          )}
        </div>

        <Link
          href="/admin/users"
          className="mt-6 inline-block text-purple-700 underline"
        >
          Back to Users
        </Link>
      </main>
    </div>
  );
}
