"use client";

import Link from "next/link";
import Image from "next/image";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isSignedIn } from "@/lib/auth";

export default function EditProfilePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Check if user is signed in - redirect to login if not
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isSignedIn()) {
        router.push("/signin");
      }
    }
  }, [router]);

  // mock form state
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");

  const username = "somchai_jaidee";
  const email = "somchai.jd@gmail.com";
  const mobile = "+66 81 234 5678";

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Saved\nname: ${name}\ndob: ${dob}\ngender: ${gender}`);
  };

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

      {/* === Layout เหมือน Address Book === */}
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-lg mb-3">Manage My Account</h3>
          <nav className="space-y-1">
            <Link href="/account" className="block rounded-md px-3 py-2 hover:bg-gray-50">
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

        {/* Main Card */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">My Profile</h2>
            {/* ปุ่ม Back (ถ้าอยากได้) */}
            {/* <Link href="/account" className="rounded-full border border-purple-300 text-purple-700 px-4 py-1.5 text-sm hover:bg-purple-50">Back</Link> */}
          </div>

          <hr className="my-4" />

          {/* แถวเดียว: ซ้ายวงกลม / ขวาฟอร์ม (จัดรูปแบบตามภาพ) */}
          <form onSubmit={onSave} className="grid grid-cols-[200px_1fr] items-start gap-6">
            {/* รูปวงกลมเทา */}
            <div className="flex items-start justify-center">
             <div className="h-44 w-44 rounded-full bg-gray-200 grid place-items-center overflow-hidden">
                               <Image src="/avatar.jpeg" alt="Avatar" width={176} height={176} />
                             </div>
            </div>

            {/* ฟอร์มด้านขวา */}
            <div className="space-y-4">
              <Row label="Username">
                <div className="text-[15px] font-medium text-gray-900">{username}</div>
              </Row>

              <Row label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-[360px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </Row>

              <Row label="Email">
                <a href={`mailto:${email}`} className="text-sm text-gray-900 underline">
                  {email}
                </a>
              </Row>

              <Row label="Mobile">
                <div className="text-sm text-gray-800">{mobile}</div>
              </Row>

              <Row label="Date of birth">
                <input
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-[360px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </Row>

              <Row label="Gender">
                <div className="flex items-center gap-6 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={gender === "male"}
                      onChange={() => setGender(gender === "male" ? "" : "male")}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Male
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={gender === "female"}
                      onChange={() => setGender(gender === "female" ? "" : "female")}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    Female
                  </label>
                </div>
              </Row>

              {/* ปุ่ม Save ชิดขวาเหมือนการ์ด Address */}
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-[#e8dbff] px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-[#dec9ff]"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

/* helper: แถว label 120px + value */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div>{children}</div>
    </div>
  );
}
