"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Paintbrush, Heart, CheckCircle2 } from "lucide-react";

type RoleId = "customer" | "creator" | "charity";

type Role = {
  id: RoleId;
  title: string;
  desc: string;
  icon: React.ElementType;
  primaryRoute: string;
};

const ROLES: Role[] = [
  {
    id: "customer",
    title: "Customer",
    desc: "Browse artworks and digital items. Add to cart and purchase easily.",
    icon: User,
    primaryRoute: "/",
  },
  {
    id: "creator",
    title: "Creator",
    desc: "Upload your works, set prices, or start auctions and track performance.",
    icon: Paintbrush,
    primaryRoute: "/artist-writer",
  },
  {
    id: "charity",
    title: "Charity",
    desc: "Manage your account and purchases related to charity programs.",
    icon: Heart,
    primaryRoute: "/charity",
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<RoleId | null>(null);

  // โหลดค่าที่เคยเลือก / ทำ migration จากค่าเก่า (seller→creator, bidder→customer)
  useEffect(() => {
    const prev = window.localStorage.getItem("musecraft.role");
    if (!prev) return;

    // map ค่าเก่าให้เข้ากับ 3 บทบาทใหม่
    const mapped =
      prev === "seller" ? "creator" :
      prev === "bidder" ? "customer" :
      prev;

    if (["customer", "creator", "charity"].includes(mapped)) {
      setSelected(mapped as RoleId);
      if (mapped !== prev) {
        window.localStorage.setItem("musecraft.role", mapped);
      }
    }
  }, []);

  const selectedRole = useMemo(
    () => ROLES.find((r) => r.id === selected) || null,
    [selected]
  );

  const saveAndGo = useCallback((role: Role) => {
    // mark as signed-in (demo)
    window.localStorage.setItem("musecraft.signedIn", "1");
    // save chosen role
    window.localStorage.setItem("musecraft.role", role.id);
    // (optional) ชื่อผู้ใช้ mock
    if (!window.localStorage.getItem("musecraft.userName")) {
      window.localStorage.setItem("musecraft.userName", "Muse User");
    }
    router.replace(role.primaryRoute);
  }, [router]);

  const onContinue = useCallback(() => {
    if (selectedRole) saveAndGo(selectedRole);
  }, [selectedRole, saveAndGo]);

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-6">
      <main className="w-full max-w-6xl rounded-2xl bg-white/90 backdrop-blur border border-purple-100 shadow-xl p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Role</h1>
          <p className="mt-2 text-gray-600">
            Pick how you want to use MuseCraft. You can change this later in Account settings.
          </p>
        </header>

        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center"
          aria-label="Role options"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            const active = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                onDoubleClick={() => saveAndGo(role)}
                className={`group relative w-full max-w-sm text-left rounded-2xl border bg-white p-5 shadow-sm transition
                hover:shadow-md focus:outline-none focus:ring-4
                ${active ? "border-purple-400 ring-4 ring-purple-200" : "border-gray-200"}`}
              >
                {active && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">
                    <CheckCircle2 className="w-4 h-4" />
                    Selected
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl transition
                    ${active ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700 group-hover:bg-purple-200"}`}
                  >
                    <Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-sm text-gray-600">{role.desc}</p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">Double-click to continue</div>
              </button>
            );
          })}
        </section>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={onContinue}
            disabled={!selectedRole}
            className={`rounded-xl px-5 py-3 font-semibold transition shadow
            ${selectedRole
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}
