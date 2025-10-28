"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ChevronRight, Apple, Facebook, Github as Google } from "lucide-react";

type Props = {
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
};

export default function SignInForm({ onSignUpClick, onForgotPasswordClick }: Props) {
  const [email, setEmail] = useState("johnsondoe@nomail.com"); // ตามภาพ
  const [password, setPassword] = useState("".padEnd(16, "*"));
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: call your real sign-in API
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    window.location.href = "/role"; // ไปหน้าเลือกบทบาทหลัง sign in
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-500">Sign in to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="space-y-4">
        {/* Email */}
        <label className="block">
          <span className="mb-1 block text-sm text-gray-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 outline-none ring-0 focus:border-gray-400"
              placeholder="you@example.com"
            />
          </div>
        </label>

        {/* Password */}
        <label className="block">
          <span className="mb-1 block text-sm text-gray-700">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 outline-none ring-0 focus:border-gray-400"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>

        {/* Sign in */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {loading ? "Signing in..." : "SING IN"}
        </button>

        {/* Create account */}
        <button
          type="button"
          onClick={onSignUpClick}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-900 hover:bg-gray-50"
        >
          Create an Account
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-1 text-sm text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          Or
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <SocialBtn icon={<Google className="h-5 w-5" />} label="Sign up with Google" />
          <SocialBtn icon={<Facebook className="h-5 w-5" />} label="Sign up with Facebook" />
          <SocialBtn icon={<Apple className="h-5 w-5" />} label="Sign up with Apple" />
        </div>

        {/* Forgot password */}
        <div className="mt-2 flex flex-col items-center gap-2 text-sm">
        <p className="mt-3 text-center text-sm">
            <Link href="/forgot-password" className="font-semibold text-purple-700 hover:underline">
            Forgot Password?
            </Link>
        </p>
        </div>
      </form>
    </div>
  );
}

/* Social button component */
function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-800 hover:bg-gray-50"
    >
      <span className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </button>
  );
}
