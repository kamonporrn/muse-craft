"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ChevronRight, Apple, Facebook, Github as Google } from "lucide-react";

type Props = {
  onSignInClick?: () => void;
  onSuccessRedirect?: string; // default: /account
};

export default function SignUpForm({ onSignInClick, onSuccessRedirect = "/account" }: Props) {
  const [name, setName] = useState("Johnson Doe");
  const [email, setEmail] = useState("johnsondoe@nomail.com");
  const [password, setPassword] = useState("".padEnd(16, "*"));
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: call your real sign-up API
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    window.location.href = onSuccessRedirect;
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-xs tracking-wider text-gray-500 mb-1">LET&apos;S GET YOU STARTED</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create an Account</h1>

      <form onSubmit={submit} className="space-y-4">
        {/* Name */}
        <label className="block">
          <span className="mb-1 block text-sm text-gray-700">Your Name</span>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 outline-none focus:border-gray-400"
              placeholder="John Doe"
            />
          </div>
        </label>

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
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 outline-none focus:border-gray-400"
              placeholder="you@example.com"
              autoComplete="email"
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
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 outline-none focus:border-gray-400"
              placeholder="••••••••••••"
              autoComplete="new-password"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {loading ? "Creating..." : "GET STARTED"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-3 text-sm text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          Or
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social sign up */}
        <div className="space-y-3">
          <SocialBtn icon={<Google className="h-5 w-5" />} label="Sign up with Google" />
          <SocialBtn icon={<Facebook className="h-5 w-5" />} label="Sign up with Facebook" />
          <SocialBtn icon={<Apple className="h-5 w-5" />} label="Sign up with Apple" />
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignInClick}
            className="font-semibold text-gray-900 underline underline-offset-2"
          >
            SIGNIN HERE
          </button>
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
