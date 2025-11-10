// app/account/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { MapPin, Wallet, Truck, MessageSquareMore, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-[#f3e8ff] text-gray-900">
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) => router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")}
        user={{ name: "Somchai", avatarUrl: "/avatar.jpeg" }}
        cartCount="10+"
      />

      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-lg mb-3">Manage My Account</h3>
          <nav className="space-y-1">
            <Link href="/account" className="block rounded-md px-3 py-2 bg-purple-50 text-purple-700 font-medium">
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
          </nav>
        </aside>

        {/* Main content */}
        <section className="space-y-6">
          {/* My Profile */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">My Profile</h2>

              {/* แก้เป็น Link เพื่อเชื่อมไปหน้า /account/profile */}
              <Link
                href="/account/editprofile"
                className="rounded-full border border-purple-300 text-purple-700 px-4 py-1.5 text-sm hover:bg-purple-50"
              >
                Edit My Profile
              </Link>
            </div>
            <hr className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              <div className="flex items-center justify-center">
                <div className="h-44 w-44 rounded-full bg-gray-200 grid place-items-center overflow-hidden">
                  <Image src="/avatar.jpeg" alt="Avatar" width={176} height={176} />
                </div>
              </div>

              <dl className="grid grid-cols-[140px_1fr] gap-y-3">
                <dt className="font-semibold text-gray-700">Username</dt>
                <dd className="text-gray-800">somchai_jaidee</dd>

                <dt className="font-semibold text-gray-700">Name</dt>
                <dd className="text-gray-800">Somchai Jaidee</dd>

                <dt className="font-semibold text-gray-700">Email</dt>
                <dd className="text-gray-800">so********@gmail.com</dd>
              </dl>
            </div>
          </div>

          {/* Address Book */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Address Book</h2>
              <Link
                href="/account/address"
                className="rounded-full border border-purple-300 text-purple-700 px-4 py-1.5 text-sm hover:bg-purple-50"
              >
                Edit My Address
              </Link>
            </div>
            <hr className="my-4" />

            <div className="rounded-xl border bg-purple-50/60 px-4 py-3 flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-purple-700" />
              <span>45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200</span>
            </div>
          </div>

          {/* Quick status cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatusCard
              icon={<Wallet className="w-10 h-10" />}
              title="Pending Payment"
              href="/orders?status=pending"
            />
            <StatusCard
              icon={<ShoppingCart className="w-10 h-10" />}
              title="Processing"
              href="/orders?status=processing"
            />
            <StatusCard
              icon={<Truck className="w-10 h-10" />}
              title="Shipping"
              href="/orders?status=shipping"
            />
            <StatusCard
              icon={<MessageSquareMore className="w-10 h-10" />}
              title="Rate Products"
              href="/orders?canReview=true"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusCard({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl shadow-sm px-6 py-6 flex flex-col items-center hover:shadow-md transition"
    >
      <div className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-gray-200 group-hover:border-purple-400">
        {icon}
      </div>
      <div className="mt-3 font-semibold text-gray-800 text-center">{title}</div>
    </Link>
  );
}
