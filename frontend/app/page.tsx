'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

export default function PaymentPage() {
  const params = useSearchParams();
  const [paid, setPaid] = useState(false);

  // ดึงข้อมูลจาก query string เช่น /payment?product=Ocean&price=1000
  const product = params.get('product') || 'Unknown Product';
  const price = params.get('price') || '0';

  // สมมติว่าเป็น promptpay link หรือข้อมูลสินค้า
  const qrValue = `https://yourshop.com/checkout?product=${product}&price=${price}`;

  const handleClick = () => {
    if (paid) return;
    setPaid(true);
    setTimeout(() => {
      alert('✅ ชำระเงินสำเร็จ ขอบคุณที่สั่งซื้อ!');
      // window.location.href = '/order-success';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-center">
      <div className="bg-white/60 p-6 rounded-2xl shadow-lg w-[320px]">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-purple-700 text-sm mb-3 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold text-purple-800 mb-4">
          Payment
        </h1>

        {/* QR Code Section */}
        <div
          onClick={handleClick}
          className="relative w-52 h-52 mx-auto flex items-center justify-center cursor-pointer"
        >
          {/* QR ของจริง */}
          <div
            className={`transition-all duration-500 ${
              paid ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <QRCodeCanvas
              value={qrValue}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>

          {/* เครื่องหมายถูก overlay */}
          {paid && (
            <div className="absolute inset-0 flex items-center justify-center animate-pop">
              <div className="bg-purple-600 rounded-full p-6 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="mt-5">
          <h2 className="text-purple-900 font-semibold text-lg">{product}</h2>
          <p className="text-sm text-gray-500">Time limit: 15:00</p>
          <p className="text-sm text-gray-700 font-medium mt-1">
            Price:{' '}
            <span className="text-purple-700 font-semibold">{price} ฿</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop {
          animation: pop 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
