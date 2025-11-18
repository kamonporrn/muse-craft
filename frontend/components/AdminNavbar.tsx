"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type AdminNavbarProps = {
  userName?: string;
  tabs?: Array<{ href: string; label: string }>;
  onSignOut?: () => void;
};

export default function AdminNavbar({
  userName: userNameProp,
  tabs,
  onSignOut,
}: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // ===== user / role =====
  const [userName, setUserName] = useState("Admin01");
  const [role, setRole] = useState("admin");
  const [mounted, setMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // ไม่ต้องตรวจสอบถ้ากำลัง sign out อยู่ - return ทันที
    if (isSigningOut) {
      return;
    }
    
    setMounted(true);
    
    // ตรวจสอบเฉพาะเมื่อ component mount และไม่ใช่หน้า signin
    if (typeof window === "undefined") return;
    
    const currentPath = window.location.pathname;
    // ไม่ต้องตรวจสอบถ้าไม่ได้อยู่ในหน้า admin
    if (!currentPath.startsWith("/admin")) {
      return;
    }
    
    try {
      const signedIn = localStorage.getItem("musecraft.signedIn");
      const n = localStorage.getItem("musecraft.userName") || "Admin01";
      const r = localStorage.getItem("musecraft.role") || "";
      setUserName(userNameProp ?? n);
      setRole(r);
      
      // ถ้าไม่ได้ sign in หรือไม่ใช่ admin ให้ redirect ไป signin
      if (!signedIn || r !== "admin") {
        // ใช้ replace เพื่อไม่ให้กลับมาหน้าเดิม
        router.replace("/signin");
      }
    } catch (error) {
      // ถ้ามี error และอยู่ในหน้า admin ให้ redirect ไป signin
      console.error("Error checking auth:", error);
      router.replace("/signin");
    }
  }, [router, userNameProp, isSigningOut]);

  // ===== tabs =====
  const navTabs = useMemo(
    () =>
      tabs ?? [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/artworks", label: "Artworks" },
        { href: "/admin/users", label: "Users" },
      ],
    [tabs]
  );

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // ===== dropdown via portal =====
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const measure = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.right, width: r.width });
  }, []);

  const toggleMenu = useCallback(() => {
    if (!open) measure();
    setOpen((v) => !v);
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current && btnRef.current.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => measure();

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, measure]);

  // ✅ เปลี่ยนปลายทางเป็นหน้า signin
  const handleSignOut = useCallback(() => {
    // ตั้ง flag ก่อนเพื่อป้องกัน useEffect redirect
    setIsSigningOut(true);
    setOpen(false);
    
    // ลบ localStorage ทั้งหมดที่เกี่ยวข้องกับ session
    try {
      localStorage.clear(); // ลบทั้งหมดเพื่อความแน่ใจ
      // หรือลบทีละตัวถ้าต้องการ
      localStorage.removeItem("musecraft.signedIn");
      localStorage.removeItem("musecraft.userName");
      localStorage.removeItem("musecraft.userEmail");
      localStorage.removeItem("musecraft.userId");
      localStorage.removeItem("musecraft.role");
      localStorage.removeItem("musecraft.roleRaw");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    
    // เรียก onSignOut callback ถ้ามี
    onSignOut?.();
    
    // ใช้ window.location.href เพื่อ force reload ทั้งหมดและ redirect
    // ไม่ใช้ replace เพราะอาจมีปัญหาในบางกรณี
    window.location.href = "/signin";
  }, [onSignOut]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 border-b border-purple-100 pointer-events-auto backdrop-blur-safari">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1">
        {/* Logo + Tabs */}
        <div className="flex items-center gap-10">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="MuseCraft Admin" width={90} height={90} priority />
            <span className="sr-only">MuseCraft Admin</span>
          </Link>

          <nav className="ml-2 hidden gap-16 text-sm md:flex">
            {navTabs.map((t) => (
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

        {/* Profile */}
        <button
          ref={btnRef}
          onClick={toggleMenu}
          aria-haspopup="menu"
          {...(open ? { "aria-expanded": "true" } : { "aria-expanded": "false" })}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          {userName} <span className="text-xs text-gray-400">({role})</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Dropdown via Portal */}
      {mounted && open &&
        createPortal(
          <div
            className="fixed z-50 pointer-events-auto dropdown-position"
            // eslint-disable-next-line react/forbid-dom-props
            style={{ 
              '--dropdown-top': `${pos.top}px`,
              '--dropdown-left': `${pos.left}px`
            } as React.CSSProperties}
          >
            <div
              role="menu"
              className="w-48 overflow-hidden rounded-md bg-white text-sm text-gray-800 shadow-lg ring-1 ring-black/5"
            >
              <button
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-red-600 hover:bg-gray-50"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
