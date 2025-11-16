// components/ForgotPasswordForm.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  onSignInClick?: () => void;
  onSent?: (identifier: string) => void;
};

export default function ForgotPasswordForm({ onSignInClick, onSent }: Props) {
  const [identifier, setIdentifier] = useState("johnsondoe@nomail.com");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => /^\s*\+?(\d[\s-]?){9,12}\s*$/.test(v);
  const valid = useMemo(() => isEmail(identifier) || isPhone(identifier), [identifier]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    // TODO: call real API
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);

    // แจ้ง parent (ถ้ามี)
    onSent?.(identifier);
    // ไปหน้า Verify ให้แน่ใจว่า navigate แน่นอน
    router.push(`/verify?to=${encodeURIComponent(identifier)}`);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="text-2xl font-semibold text-gray-900">Forget Password</h1>
      <p className="mt-3 text-lg text-gray-600">
        Please enter your registered Email or Mobile Number to reset your password
      </p>

      {sent && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          We&apos;ve sent a recovery link (or OTP) to <span className="font-semibold">{identifier}</span>.
          Please check your inbox/SMS.
        </div>
      )}

      <form onSubmit={submit} className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-2 block text-sm text-gray-700">Email / Mobile Number</span>
          {valid ? (
            <input
              type="text"
              inputMode="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="johnsondoe@nomail.com"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-400"
            />
          ) : (
            <input
              type="text"
              inputMode="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="johnsondoe@nomail.com"
              className="w-full rounded-2xl border border-red-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-red-400"
              aria-invalid="true"
            />
          )}
        </label>

        <button
          type="submit"
          disabled={!valid || loading}
          className={`w-full rounded-2xl px-6 py-3 font-semibold shadow-md transition
            ${!valid || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-black"}`}
        >
          {loading ? "Sending..." : "Recover Password"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Remember your password?{" "}
        {onSignInClick ? (
          <button onClick={onSignInClick} className="font-semibold text-gray-900 underline underline-offset-2">
            LOGIN HERE
          </button>
        ) : (
          <Link href="/signin" className="font-semibold text-gray-900 underline underline-offset-2">
            LOGIN HERE
          </Link>
        )}
      </div>
    </div>
  );
}
