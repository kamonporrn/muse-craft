"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { fetchCurrentUser, type ApiUser } from "@/lib/api";

export default function SettingPage() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Format phone number for display
  const formatPhone = (phone?: string) => {
    if (!phone) return "N/A";
    if (phone.length === 10) {
      return `${phone.slice(0, 3)} - ${phone.slice(3, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full max-w-16xl flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
        <div className="flex w-full justify-center">
            {/* แก้แค่ max-w-5xl -> max-w-6xl */}
            <div className="w-full max-w-16xl flex flex-col gap-6">
              {/* STORE INFORMATION CARD */}
              <div className="relative bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Store Information
                  </h2>
    
                  {/* Edit button – ใส่ลิงก์ไปหน้า edit ได้ตามต้องการ */}
                  <Link
                    href="/artist-writer/setting/edit"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#9317ff] hover:bg-[#e097ff] text-white text-bold shadow-md transition"
                  >
                    <Icon icon="mdi:pencil-outline" className="text-lg text-white" />
                    Edit
                  </Link>
                </div>
    
                {/* Avatar */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden shadow-md border-4 border-white">
                      {/* รูปร้านค้า */}
                      <img
                        src={user?.avatar || "/images/store-avatar-placeholder.jpg"}
                        alt="Store avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
    
                {/* Info fields */}
                <div className="flex flex-col gap-4">
                  {/* Store Name */}
                  <div className="flex items-center gap-4 bg-[#ffffff] rounded-2xl px-5 py-4 shadow-sm border border-[#f3e8ff]">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:storefront-outline" className="text-xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">
                        Store&apos;s Name
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-800">
                        {user?.storeName || "N/A"}
                      </span>
                    </div>
                  </div>
    
                  {/* Owner */}
                  <div className="flex items-center gap-4 bg-[#ffffff] rounded-2xl px-5 py-4 shadow-sm border border-[#f3e8ff]">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:account-outline" className="text-xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">
                        Owner Name
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-800">
                        {user?.name || "N/A"}
                      </span>
                    </div>
                  </div>
    
                  {/* Address */}
                  <div className="flex items-center gap-4 bg-[#ffffff] rounded-2xl px-5 py-4 shadow-sm border border-[#f3e8ff]">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:map-marker-outline" className="text-xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">
                        Address
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-800">
                        {user?.address || "N/A"}
                      </span>
                    </div>
                  </div>
    
                  {/* Email */}
                  <div className="flex items-center gap-4 bg-[#ffffff] rounded-2xl px-5 py-4 shadow-sm border border-[#f3e8ff]">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:email-outline" className="text-xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">
                        Email
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-800">
                        {user?.email || "N/A"}
                      </span>
                    </div>
                  </div>
    
                  {/* Phone */}
                  <div className="flex items-center gap-4 bg-[#ffffff] rounded-2xl px-5 py-4 shadow-sm border border-[#f3e8ff]">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:phone-outline" className="text-xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-400">
                        Phone
                      </span>
                      <span className="text-sm md:text-base font-semibold text-gray-800">
                        {formatPhone(user?.phone)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
    
              {/* SWITCH ROLE + SIGN OUT SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Switch Role */}
                <div className="bg-white rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.06)] p-5 border-l-4 border-[#9317ff]">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:account-switch-outline" className="text-2xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        Switch Account Role
                      </span>
                      <span className="text-xs text-gray-500">
                        Currently: Seller
                      </span>
                      <button 
                        onClick={() => {
                          window.location.href = '/role';
                        }}
                        className="mt-2 text-xs font-medium text-[#9317ff] hover:underline"
                      >
                        Switching account &gt;
                      </button>
                    </div>
                  </div>
                </div>
    
                {/* Sign Out */}
                <div className="bg-white rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.06)] p-5 border-l-4 border-[#9317ff]">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#C44DFF47] translate-x-[2px]">
                      <Icon icon="mdi:logout-variant" className="text-2xl text-[#9317ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        Sign out
                      </span>
                      <span className="text-xs text-gray-500">
                        Log out of your account safely
                      </span>
                      <button 
                        onClick={() => {
                          // Clear all localStorage
                          localStorage.clear();
                          // Redirect to sign in
                          window.location.href = '/signin';
                        }}
                        className="mt-2 text-xs font-medium text-[#9317ff] hover:underline"
                      >
                        Click to sign out &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}
