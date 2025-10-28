"use client";

import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Magical background  */}
      <div className="absolute inset-0 -z-10 bg-[url('/bg-overlay.png')]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 -right-24 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />

      <main className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1.1fr_1fr]">
        {/* Left brand area */}
        <section className="hidden md:flex items-center justify-center">
          <div className="text-center select-none">
            {/* ใส่โลโก้/ภาพแบรนด์ใหญ่ */}
            <img
              src="/logo.png"
              alt="MuseCraft"
              className="mx-auto w-[360px] max-w-full drop-shadow-sm"
            />
          </div>
        </section>

        {/* Right auth card */}
        <section className="flex items-center">
          <div className="w-full rounded-2xl border border-gray-200/70 bg-white/90 backdrop-blur p-6 shadow-xl md:p-8">
            <SignInForm
              onSignUpClick={() => (window.location.href = "/signup")}
              onForgotPasswordClick={() => (window.location.href = "/signin?mode=forgot")}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
