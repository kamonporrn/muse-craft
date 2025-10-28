// app/account/address/page.tsx
"use client";

import Link from "next/link";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  isDefault?: boolean;
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: "a1",
    name: "Mr. Somchai Jaidee",
    phone: "(+66) 81 234 5678",
    line1: "45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai,",
    line2: "Chiang Mai 50200",
    isDefault: true,
  },
  {
    id: "a2",
    name: "somchai_jaidee",
    phone: "(+66) 81 234 5678",
    line1: "89 Sirisuk Village, Soi Pracha Uthit 25, Bang Mot, Thung Khru,",
    line2: "Bangkok 10140",
  },
  {
    id: "a3",
    name: "Mr. Somchai Jaidee",
    phone: "(+66) 81 234 5678",
    line1: "123 Main Street Apt. 4B New York, NY 10001",
    line2: "USA",
  },
];

export default function AddressBookPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Address[]>(MOCK_ADDRESSES);

  // DEMO: แก้ไขด้วย prompt แล้วอัปเดตใน state
  function handleEdit(a: Address) {
    const name = window.prompt("Name", a.name);
    if (name === null) return;
    const phone = window.prompt("Phone", a.phone);
    if (phone === null) return;
    const line1 = window.prompt("Address line 1", a.line1);
    if (line1 === null) return;
    const line2 = window.prompt("Address line 2 (optional)", a.line2 ?? "") ?? a.line2;

    setItems((prev) =>
      prev.map((it) =>
        it.id === a.id ? { ...it, name, phone, line1, line2 } : it
      )
    );
  }

  // DEMO: ลบออกจาก state หลังยืนยัน
  function handleDelete(id: string) {
    if (!window.confirm("Delete this address?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#f3e8ff] text-gray-900">
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) =>
          router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
        }
        user={{ name: "Somchai", avatarUrl: "/avatar.jpeg" }}
        cartCount="10+"
      />

      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-lg mb-3">Manage My Account</h3>
          <nav className="space-y-1">
            <Link href="/account" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Profile
            </Link>
            <Link href="/account/address" className="block rounded-md px-3 py-2 bg-purple-50 text-purple-700 font-medium">
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
            <Link href="/coupons" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              Coupons
            </Link>
          </nav>
        </aside>

        {/* Address Book */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Address Book</h2>
            <button
              className="rounded-full border border-purple-300 text-purple-700 px-4 py-1.5 text-sm hover:bg-purple-50"
              onClick={() => alert("Open Add Address modal (demo)")}
            >
              Add My Address
            </button>
          </div>

          <hr className="my-4" />

          <div className="space-y-4">
            {items.map((a) => (
              <div
                key={a.id}
                className="rounded-xl bg-purple-50/70 px-4 py-4 shadow-[0_1px_0_#e9d5ff] ring-1 ring-[#eadcff] text-gray-800"
              >
                {/* แถวบน: ชื่อ/เบอร์ + Default + ปุ่มแก้/ลบ */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="font-semibold">
                    {a.name}
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="font-normal">{a.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {a.isDefault && (
                      <span className="rounded-full bg-purple-600 text-white text-xs px-2 py-0.5">
                        Default
                      </span>
                    )}

                    <button
                      onClick={() => handleEdit(a)}
                      className="inline-flex items-center gap-1 rounded-md border border-purple-300 text-purple-700 px-2 py-1 text-xs hover:bg-purple-50"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-300 text-red-600 px-2 py-1 text-xs hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* แถวล่าง: รายละเอียดที่อยู่ */}
                <div className="mt-2 text-[15px] leading-6">
                  {a.line1}
                  {a.line2 ? (
                    <>
                      <br />
                      {a.line2}
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
