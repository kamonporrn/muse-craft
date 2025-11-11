"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, User, LogOut } from "lucide-react";

type CharityNavbarProps = {
  logoSrc?: string;            // path รูปโลโก้ เช่น "/logo.png" หรือ "/logo-charity.png"
  userName?: string;           // ชื่อผู้ใช้ ถ้าไม่ส่งมาจะอ่านจาก localStorage
  onSignOut?: () => void;      // callback เสริม ตอนกดออกจากระบบ
};

export default function CharityNavbar({
  logoSrc = "/logo.png",
  userName: userNameProp,
  onSignOut,
}: CharityNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState("Charity");
  const [role, setRole] = useState("charity");
  const [q, setQ] = useState("");

  // โหลดค่าจาก localStorage ฝั่ง client
  useEffect(() => {
    try {
      const n = localStorage.getItem("musecraft.userName") || "Charity";
      const r = localStorage.getItem("musecraft.role") || "charity";
      setUserName(userNameProp ?? n);
      setRole(r);
      // ถ้าไม่ได้เป็น charity ให้เด้งไป signin
      if (r !== "charity") router.replace("/signin");
    } catch {
      // เผื่อกรณี SSR/permission
      router.replace("/signin");
    }
  }, [router, userNameProp]);

  const tabs = useMemo(
    () => [
      { href: "/charity", label: "Dashboard" },
      { href: "/auctions", label: "Auctions" },
      { href: "/#categories", label: "Categories" },
    ],
    []
  );

  const isActive = (href: string) =>
    href === "/charity" ? pathname === "/charity" : pathname.startsWith(href);

  const handleSignOut = useCallback(() => {
    onSignOut?.();
    try {
      localStorage.removeItem("musecraft.signedIn");
      localStorage.removeItem("musecraft.userName");
      localStorage.removeItem("musecraft.role");
      localStorage.removeItem("musecraft.roleRaw");
    } catch {}
    router.replace("/"); // 👉 กลับหน้า Home
    router.refresh();
  }, [onSignOut, router]);

  return (
    <header className="sticky top-0 z-40 border-b border-purple-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Logo + Tabs */}
        <div className="flex items-center gap-10">
          <Link href="/charity" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="MuseCraft Charity"
              width={90}
              height={90}
              priority
              className="h-20 w-20"
            />
            <span className="sr-only">MuseCraft Charity</span>
          </Link>

          <nav className="hidden gap-10 text-sm md:flex">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={[
                  "px-1 py-0.5 transition",
                  isActive(t.href)
                    ? "font-semibold text-purple-600"
                    : "text-gray-700 hover:text-purple-700",
                ].join(" ")}
                aria-current={isActive(t.href) ? "page" : undefined}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search + User + Sign out */}
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-gray-200">
            <User className="h-5 w-5 text-purple-700" />
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
