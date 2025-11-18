// app/payment/[orderId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Copy, Check, Download, Timer, Info, ArrowLeft } from "lucide-react";
import { isSignedIn } from "@/lib/auth";

export default function PaymentQRPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const sp = useSearchParams();
  const router = useRouter();

  // Check if user is signed in - redirect to login if not
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isSignedIn()) {
        router.push("/signin");
      }
    }
  }, [router]);

  // demo params (ส่งมาทาง query ได้ เช่น ?title=Ocean%27s%20Whisper&amount=1000)
  const title = sp.get("title") || "Ocean’s Whisper";
  const amount = Number(sp.get("amount") || 1000); // THB
  const minutes = Number(sp.get("mins") || 15);    // นาทีหมดเวลา (เดโม่)

  // อ้างอิงชำระเงิน (เดโม่)
  const reference = useMemo(
    () => `MC-${(orderId || "XXXXXX").slice(0, 8).toUpperCase()}`,
    [orderId]
  );

  // ----------- Countdown -----------
  const [leftSec, setLeftSec] = useState(minutes * 60);
  useEffect(() => {
    if (leftSec <= 0) return;
    const id = setInterval(() => setLeftSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [leftSec]);

  const mm = Math.floor(leftSec / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(leftSec % 60)
    .toString()
    .padStart(2, "0");

  const expired = leftSec <= 0;
  const progress = Math.max(0, Math.min(100, (leftSec / (minutes * 60)) * 100));

  // ----------- helpers -----------
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const downloadQR = () => {
    // สำหรับเดโม่: ดาวน์โหลดภาพไฟล์ /promptpay-qr.png
    const a = document.createElement("a");
    a.href = "/promptpay-qr.png"; // ใส่ไฟล์ QR ของคุณใน public/
    a.download = `QR-${reference}.png`;
    a.click();
  };

  const markPaid = () => {
    if (expired) {
      alert("หมดเวลาชำระแล้ว โปรดสร้างคำสั่งซื้อใหม่");
      return;
    }
    alert("เราได้รับการชำระเงินของคุณแล้ว (Demo)");
    router.replace(`/orders/${orderId || "demo"}`);
  };

  return (
    <main className="min-h-screen bg-[#F2E7FF] text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-purple-700 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-purple-700">
          Payment
        </h1>

        {/* Card */}
        <section className="mt-6 rounded-2xl bg-white shadow-xl p-6 md:p-8">
          {/* Countdown + progress */}
          <div className="mb-4 flex items-center justify-center gap-2 text-purple-700">
            <Timer className="w-5 h-5" />
            <span className={`font-semibold ${expired ? "text-red-600" : ""}`}>
              Time limit : {mm}:{ss}
            </span>
          </div>
          <div className="mx-auto mb-6 h-2 w-64 overflow-hidden rounded-full bg-purple-100">
            <div
              className={`h-2 rounded-full ${
                expired ? "bg-red-400" : "bg-purple-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* QR */}
          <div className="mx-auto max-w-md rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
            <Image
              src="/promptpay-qr.png" // ใส่ QR จริงของคุณไว้ใน public/
              alt="PromptPay QR"
              width={640}
              height={640}
              className="w-full rounded-lg"
              priority
            />
          </div>

          {/* Title/Amount */}
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-purple-700">{title}</h2>
            <div className="mt-2 text-gray-700">
              <span className="font-medium">Price :</span>{" "}
              <span className="font-bold">
                {amount.toLocaleString("en-US")} B
              </span>
            </div>
          </div>

          {/* Order meta + copy buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <MetaRow
              label="Order No."
              value={orderId || "demo-order"}
              onCopy={() => copy(orderId || "demo-order", "order")}
              copied={copied === "order"}
            />
            <MetaRow
              label="Reference"
              value={reference}
              onCopy={() => copy(reference, "ref")}
              copied={copied === "ref"}
            />
            <MetaRow
              label="Amount"
              value={`${amount.toLocaleString("en-US")} B`}
              onCopy={() => copy(String(amount), "amt")}
              copied={copied === "amt"}
            />
            <MetaRow
              label="Expires In"
              value={`${mm}:${ss}`}
              disabled
              copied={false}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={downloadQR}
              className="inline-flex items-center gap-2 rounded-lg border border-purple-300 bg-white px-4 py-2 font-semibold text-purple-700 hover:bg-purple-50"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>

            <button
              onClick={markPaid}
              disabled={expired}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 font-semibold text-white shadow
                ${
                  expired
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
            >
              ฉันชำระเงินแล้ว
            </button>
          </div>

          {/* Tips / Instructions */}
          <div className="mt-8 rounded-xl bg-purple-50 p-4 text-sm text-purple-900">
            <div className="mb-2 inline-flex items-center gap-2 font-semibold">
              <Info className="w-4 h-4" /> วิธีชำระเงินด้วยแอปธนาคาร (PromptPay)
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
              <li>เปิดแอปธนาคารของคุณ</li>
              <li>เลือกเมนู “สแกน/Scan” และสแกน QR ด้านบน</li>
              <li>ยืนยันยอดเงินให้ตรงกับที่แสดง แล้วกดยืนยันชำระ</li>
              <li>กลับมาหน้านี้แล้วกด “ฉันชำระเงินแล้ว”</li>
            </ol>
            {expired && (
              <p className="mt-3 font-semibold text-red-600">
                * QR นี้หมดอายุแล้ว กรุณาสร้างคำสั่งซื้อใหม่
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetaRow({
  label,
  value,
  onCopy,
  copied,
  disabled,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-semibold text-gray-800 break-all">{value}</div>
      </div>
      {!disabled && (
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
      )}
    </div>
  );
}
