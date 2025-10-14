"use client";

import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import { useCallback } from "react";

type NavbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void; // NEW: submit handler (optional)
  onSignIn?: () => void;
  onSignUp?: () => void;
};

export default function Navbar({
  search,
  onSearchChange,
  onSearchSubmit,
  onSignIn,
  onSignUp,
}: NavbarProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearchSubmit?.(search);
    },
    [onSearchSubmit, search]
  );

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
        <button className="text-purple-700 font-medium" onClick={onSignIn}>
          Sign In
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
          onClick={onSignUp}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
