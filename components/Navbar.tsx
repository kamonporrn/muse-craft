"use client";

import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

type NavbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSignIn?: () => void;  // optional override
  onSignUp?: () => void;  // optional override
};

export default function Navbar({
  search,
  onSearchChange,
  onSearchSubmit,
  onSignIn,
  onSignUp,
}: NavbarProps) {
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearchSubmit?.(search);
    },
    [onSearchSubmit, search]
  );

  const handleSignIn = useCallback(() => {
    if (onSignIn) return onSignIn();
    router.push("/signin");              // ← go to SIGN-IN page
  }, [onSignIn, router]);

  const handleSignUp = useCallback(() => {
    if (onSignUp) return onSignUp();
    router.push("/signup");              // ← adjust if your route differs
  }, [onSignUp, router]);

  return (
    <header className="flex justify-between items-center px-8 py-2 bg-purple-50 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-1">
        <Image src="/logo.png" alt="MuseCraft Logo" width={100} height={100} />
      </div>

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

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative" aria-label="Cart">
          <ShoppingCart className="w-6 h-6 text-purple-700" />
        </button>
        <button className="text-purple-700 font-medium" onClick={handleSignIn}>
          Sign In
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
