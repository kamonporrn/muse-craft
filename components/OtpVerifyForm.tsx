"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  /** email หรือเบอร์โทรที่จะแสดงบนหน้า verify; ถ้าไม่ส่งจะอ่านจาก query ?id= */
  identifier?: string;
  /** เสร็จแล้วจะ redirect ไปไหน (ดีฟอลต์ /signin) */
  redirectTo?: string;
};

export default function OtpVerifyForm({ identifier, redirectTo = "/signin" }: Props) {
  const router = useRouter();
  const search = useSearchParams();

  // ถ้าไม่ส่ง prop มา จะ fallback ไปอ่าน query ?id=
  const target = identifier ?? search.get("id") ?? "your email/phone";

  const [code, setCode] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  // refs for 4 inputs (typed correctly)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  
  const canVerify = useMemo(() => code.join("").length === 4, [code]);

  const handleChange = (idx: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(0, 1);
    setCode((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canVerify) return;

    // DEMO only: fake verifying -> show success -> redirect
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    setVerifying(false);
    setSuccess(true);
    setTimeout(() => router.push(redirectTo), 1200);
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-semibold text-gray-900">Verify Code</h1>
      <p className="mt-2 text-gray-600">
        We&apos;ve sent an OTP to <span className="font-medium">{target}</span>. Please check your inbox/SMS.
      </p>

      {success && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-center">
          ✅ Verified! Redirecting…
        </div>
      )}

      <form onSubmit={submit} className="mt-6">
        <div className="flex items-center justify-between gap-3">
          {code.map((v, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el }}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-14 text-center rounded-xl border border-gray-300 bg-white text-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!canVerify || verifying || success}
          className={`mt-8 w-full rounded-xl py-3 font-semibold shadow-md transition
            ${!canVerify || verifying || success
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-black"}`}
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="font-semibold text-purple-700 hover:underline"
            onClick={() => {
              setCode(["", "", "", ""]);
              inputsRef.current[0]?.focus();
            }}
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
}
