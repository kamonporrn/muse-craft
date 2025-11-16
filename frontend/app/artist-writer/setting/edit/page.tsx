"use client";

import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EditSettingPage() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string>("/images/store-avatar-placeholder.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Save data to API
    // After saving, redirect to setting page
    router.push("/artist-writer/setting");
  };
  return (
    <div className="min-h-full bg-[#f6e9ff] px-6 py-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Store Information
          </h2>
        </div>

        {/* EDIT FORM CARD */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-8">
          
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-md border-4 border-white bg-gray-100">
                <img
                  src={avatarPreview}
                  alt="Store avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-label="Upload store avatar"
              />

              {/* camera button */}
              <button 
                type="button" 
                onClick={handleAvatarClick}
                aria-label="Change store avatar" 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#9317ff] text-white shadow-md hover:bg-[#7d12d8] transition-colors cursor-pointer"
              >
                <Icon icon="mdi:camera-outline" className="text-lg" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to change avatar</p>
          </div>

          {/* FORM INPUTS */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Store Name */}
            <div>
              <label htmlFor="storeName" className="text-sm font-medium text-gray-700">Store Name</label>
              <input
                id="storeName"
                type="text"
                defaultValue="Happy Story"
                placeholder="Enter store name"
                className="mt-1 w-full rounded-xl border border-[#e6d4ff] px-4 py-3 focus:outline-none focus:border-[#9317ff]"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="text-sm font-medium text-gray-700">Owner Name</label>
              <input
                id="ownerName"
                type="text"
                defaultValue="Sophia Mitchell"
                placeholder="Enter owner name"
                className="mt-1 w-full rounded-xl border border-[#e6d4ff] px-4 py-3 focus:outline-none focus:border-[#9317ff]"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
              <input
                id="address"
                type="text"
                defaultValue="123 Chiang Rai, Thailand, 71000"
                placeholder="Enter address"
                className="mt-1 w-full rounded-xl border border-[#e6d4ff] px-4 py-3 focus:outline-none focus:border-[#9317ff]"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                defaultValue="@happy_story.com"
                placeholder="Enter email address"
                className="mt-1 w-full rounded-xl border border-[#e6d4ff] px-4 py-3 focus:outline-none focus:border-[#9317ff]"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="text"
                defaultValue="098 - 7654-321"
                placeholder="Enter phone number"
                className="mt-1 w-full rounded-xl border border-[#e6d4ff] px-4 py-3 focus:outline-none focus:border-[#9317ff]"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">

              {/* CANCEL BUTTON */}
              <a
                href="/artist-writer/setting"
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </a>

              {/* SAVE BUTTON */}
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#9317ff] text-white font-medium hover:bg-[#7d12d8] transition"
              >
                Save Changes
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
