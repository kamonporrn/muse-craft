"use client";

import Image from "next/image";
import OtpVerifyForm from "@/components/OtpVerifyForm";
import { useSearchParams } from "next/navigation";

export default function OtpVerifyPage() {
  const sp = useSearchParams();
  // รับค่าจาก ?id=... (เช่น email/เบอร์โทร)
  const identifier = sp.get("id") ?? "johnsondoe@nomail.com";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* dreamy background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#E9D5FF] via-[#F5E6FF] to-white" />
      <div className="pointer-events-none absolute -top-24 -left-28 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

      <main className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 gap-0 px-6 py-10 md:grid-cols-[1fr_1.2fr]">
        {/* left logo panel */}
        <section className="hidden md:flex items-center justify-center rounded-l-2xl bg-white/30 backdrop-blur border border-white/60 shadow-xl">
          <div className="p-8">
            <Image
              src="/logo.png"
              alt="MuseCraft"
              width={300}
              height={300}
              className="mx-auto drop-shadow"
              priority
            />
          </div>
        </section>

        {/* right card */}
        <section className="rounded-2xl md:rounded-l-none border border-white/60 bg-white/90 backdrop-blur shadow-xl p-6 md:p-10">
          <OtpVerifyForm identifier={identifier} />
        </section>
      </main>
    </div>
  );
}
