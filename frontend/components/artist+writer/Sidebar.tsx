'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { label: "Home", path: "/artist-writer" },
  { label: "Finance", path: "/artist-writer/finance" },
  { label: "My Product", path: "/artist-writer/my-product" },
  { label: "Auction Event", path: "/artist-writer/auction-event" },
  { label: "Setting", path: "/artist-writer/setting" },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[260px] flex items-start bg-[#f6e9ff]">
      {/* กล่องสีขาว + เงา */}
      <div className="mt-8 ml-4 w-full bg-white rounded-[20px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative block w-full rounded-xl px-5 py-2 text-left text-[15px] font-medium transform transition-all duration-200 ${
                  isActive
                    ? "bg-[#C44DFF47] text-[#7A1CC2] translate-x-[2px]"
                    : "text-[#222222] hover:bg-[#C44DFF1A]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;