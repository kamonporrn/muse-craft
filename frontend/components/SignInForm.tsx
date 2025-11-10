"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ChevronRight, Apple, Facebook, Github as Google } from "lucide-react";
import { validateUser } from "@/lib/users";

type Props = { onSignUpClick?: () => void; onForgotPasswordClick?: () => void };

export default function SignInForm({ onSignUpClick }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");        // เดิมใช้ padEnd ไม่จำเป็น
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 300)); // เดโม่ latency
    const user: any = validateUser(email, password);

    setLoading(false);

    if (!user) {
      setErr("Invalid email or password.");
      return;
    }
    if (user._error === "suspended") {
      setErr("This account is suspended. Please contact support.");
      return;
    }
    if (user._error === "deleted") {
      setErr("This account has been deleted.");
      return;
    }

    // ✅ ทำให้ role สอดคล้องกับ guards (ซึ่งเช็ค 'admin' ตัวเล็ก)
    const roleLower = String(user.role || "").toLowerCase(); // "Admin" -> "admin"

    // เก็บ session (demo)
    localStorage.setItem("musecraft.signedIn", "true");
    localStorage.setItem("musecraft.userName", user.name);
    localStorage.setItem("musecraft.role", roleLower);       // เก็บแบบตัวเล็ก
    localStorage.setItem("musecraft.roleRaw", user.role);    // เผื่อใช้แสดงผล

    // นำทาง
    router.replace(roleLower === "admin" ? "/admin" : "/role");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-500">Sign in to continue</p>
      </div>

      {err && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
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
              placeholder="example@example.com"
              autoComplete="email"
            />
          </div>
        </label>

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
              placeholder="••••••••"
              autoComplete="current-password"
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

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>

        <button
          type="button"
          onClick={onSignUpClick}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-900 hover:bg-gray-50"
        >
          Create an Account
        </button>

        <div className="flex items-center gap-4 py-1 text-sm text-gray-500">
          <span className="h-px flex-1 bg-gray-200" /> Or <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          <SocialBtn icon={<Google className="h-5 w-5" />} label="Sign in with Google" />
          <SocialBtn icon={<Facebook className="h-5 w-5" />} label="Sign in with Facebook" />
          <SocialBtn icon={<Apple className="h-5 w-5" />} label="Sign in with Apple" />
        </div>

        <p className="mt-3 text-center text-sm">
          <Link href="/forgot-password" className="font-semibold text-purple-700 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}

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
