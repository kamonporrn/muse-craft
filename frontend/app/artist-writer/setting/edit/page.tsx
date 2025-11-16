"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function EditSettingPage() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string>("/images/store-avatar-placeholder.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phoneError, setPhoneError] = useState<string>("");
  const [phoneValue, setPhoneValue] = useState<string>("0987654321");

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload avatar image"
              />

              {/* camera button */}
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#9317ff] text-white shadow-md hover:bg-[#7d12d8] transition-colors cursor-pointer" 
                aria-label="Change avatar image"
                type="button"
              >
                <Icon icon="mdi:camera-outline" className="text-lg" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to change avatar</p>
          </div>

          {/* FORM INPUTS */}
          <form 
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              // After saving, redirect to setting page
              router.push('/artist-writer/setting');
            }}
          >
            
            {/* Store Name */}
            <div>
              <label htmlFor="storeName" className="text-sm font-medium text-gray-700">Store Name</label>
              <input
                id="storeName"
                type="text"
                defaultValue="Happy Story"
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
                className="mt-1 w-full rounded-xl border border-[#e6d4ff] px-4 py-3 focus:outline-none focus:border-[#9317ff]"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phoneValue}
                maxLength={10}
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPhoneValue(value);
                  
                  if (value.length > 0 && value.length !== 10) {
                    setPhoneError("Phone number must be exactly 10 digits");
                  } else {
                    setPhoneError("");
                  }
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                className={`mt-1 w-full rounded-xl border px-4 py-3 focus:outline-none ${
                  phoneError 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#e6d4ff] focus:border-[#9317ff]'
                }`}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-500">{phoneError}</p>
              )}
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
  );
}
