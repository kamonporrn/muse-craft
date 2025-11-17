"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, FormEvent } from "react";
import { Bell, ShoppingCart, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type NavbarSignedInProps = {
  search: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit?: (v: string) => void;
  cartCount?: number | string;
  user: { name: string; avatarUrl?: string };
  onSignOut?: () => void;
  onCartClick?: () => void;
  onBellClick?: () => void;
};

export default function NavbarSignedIn({
  search,
  onSearchChange,
  onSearchSubmit,
  cartCount = "10+",
  user,
  onSignOut,
  onCartClick,
  onBellClick,
}: NavbarSignedInProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSearchSubmit?.(search);
    },
    [onSearchSubmit, search]
  );

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("musecraft.signedIn");
    localStorage.removeItem("musecraft.userName");
    localStorage.removeItem("musecraft.role");
    onSignOut?.();
    router.replace("/");
    router.refresh();
  }, [onSignOut, router]);

  return (
    <header className="flex justify-between items-center px-20 py-2 bg-purple-50 shadow-sm">
      {/* Logo → Home */}
      <Link
        href="/"
        aria-label="Go to Home"
        className="flex items-center gap-1 cursor-pointer select-none"
      >
        <Image src="/logo.png" alt="MuseCraft Logo" width={100} height={100} priority />
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-1/2 bg-white rounded-full px-4 py-2 shadow"
        role="search"
        aria-label="Site search"
      >
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent outline-none px-2 text-gray-700"
          aria-label="Search input"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
          aria-label="Submit search"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      
      {/* Cart */}
      <button
        className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-purple-100"
        aria-label="Cart"
        onClick={onCartClick}
      >
        <ShoppingCart className="w-6 h-6 text-purple-700" />
        <span className="absolute -top-1 -right-1 rounded-full bg-purple-600 text-white text-[10px] px-1.5 font-bold shadow">
          {cartCount}
        </span>
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-full bg-white text-purple-700 px-3 py-1.5 shadow hover:bg-purple-50"
          onClick={() => setOpen((v) => !v)}
        >
          <Image
            src={user.avatarUrl || "/avatar.jpeg"}
            alt={user.name}
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{user.name}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-md bg-white text-gray-800 shadow-lg ring-1 ring-black/5 overflow-hidden">
            <Link
              href="/account"
              className="block px-3 py-2 hover:bg-gray-50 text-sm"
              onClick={() => setOpen(false)}
            >
              My Account
            </Link>

            <Link
              href="/orders"
              className="block px-3 py-2 hover:bg-gray-50 text-sm"
              onClick={() => setOpen(false)}
            >
              My Orders
            </Link>

            {/* ✅ NEW: Switch Role */}
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
              onClick={() => {
                // ลบ role เดิมเพื่อให้หน้า /role บังคับเลือกใหม่
                localStorage.removeItem("musecraft.role");
                setOpen(false);
                // ไปหน้าเลือกบทบาท
                window.location.href = "/role";
                // ถ้าอยากใช้ Next router แทน:
                // router.push("/role");
              }}
            >
              Switch Role
            </button>

            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
