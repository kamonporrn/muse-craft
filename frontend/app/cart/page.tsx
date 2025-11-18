// app/cart/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Heart, CheckSquare, Square } from "lucide-react";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { useRouter } from "next/navigation";
import { isSignedIn } from "@/lib/auth";

type CartItem = {
  id: string;
  title: string;          // group title (e.g., shop/collection)
  name: string;           // product name
  subtitle: string;       // small description
  img: string;
  price: number;          // number only; render as ฿
  available: boolean;     // false = Unavailable item
  checked?: boolean;      // UI selection
};

const THB = (n: number) =>
  `฿${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const MOCK_ITEMS: CartItem[] = [
  {
    id: "p1",
    title: "Amazing Pottery",
    name: "Blue-and-white porcelain vase",
    subtitle: "21 CM, Premium ceramic",
    img: "/cart-pottery.jpg", // ใส่รูปของคุณเอง
    price: 360,
    available: true,
    checked: true,
  },
  {
    id: "p2",
    title: "Amazing E-book",
    name: "What is love?",
    subtitle: "Romance Novel, E-book",
    img: "/cart-ebook.jpg",
    price: 1200,
    available: true,
    checked: true,
  },
  {
    id: "p3",
    title: "Unavailable Item",
    name: "Woman with a Parasol – Madame Monet and Her Son",
    subtitle: "Painting on canvas",
    img: "/cart-monet.jpg",
    price: 500,
    available: false,
    checked: false,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState<null | { code: string; discount: number }>(null);

  // Check if user is signed in - redirect to login if not
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isSignedIn()) {
        router.push("/signin");
      }
    }
  }, [router]);

  // derived lists
  const available = items.filter((i) => i.available);
  const unavailable = items.filter((i) => !i.available);

  const allChecked = available.length > 0 && available.every((i) => i.checked);
  const someChecked = available.some((i) => i.checked);

  const subtotal = useMemo(
    () => available.filter((i) => i.checked).reduce((sum, it) => sum + it.price, 0),
    [available]
  );

  const shipping = someChecked ? 100 : 0; // เดโม่: มีเลือกสินค้า → คิดค่าส่ง 100
  const discount = couponApplied ? couponApplied.discount : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  // handlers
  const toggleAll = (checked: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.available ? { ...i, checked } : i))
    );
  };

  const toggleOne = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const delOne = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const delSelected = () => {
    if (!someChecked) return;
    if (!confirm("Delete selected items?")) return;
    setItems((prev) => prev.filter((i) => !(i.available && i.checked)));
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    // เดโม่: ถ้าเป็น MC50 ลด 50 บาท, MC100 ลด 100 บาท
    const table: Record<string, number> = { MC50: 50, MC100: 100 };
    const discount = table[code] ?? 0;
    setCouponApplied(discount ? { code, discount } : null);
    if (!discount) alert("Coupon not valid (demo)");
  };

  return (
    <main className="min-h-screen bg-[#F2E7FF] text-gray-900">
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) => router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")}
        user={{ name: "Somchai", avatarUrl: "/avatar.jpeg" }}
        cartCount={items.length}
        onCartClick={() => router.push("/cart")}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
        {/* LEFT: list */}
        <section className="space-y-4">
          {/* Select all bar */}
          <div className="rounded-xl bg-white px-4 py-3 flex items-center justify-between shadow-sm">
            <button
              onClick={() => toggleAll(!allChecked)}
              className="flex items-center gap-3"
            >
              {allChecked ? (
                <CheckSquare className="w-5 h-5 text-purple-600" />
              ) : (
                <Square className="w-5 h-5 text-purple-600" />
              )}
              <span className="font-medium">
                Select All ({available.length} Items)
              </span>
            </button>

            <button
              onClick={delSelected}
              className={`inline-flex items-center gap-2 text-sm ${
                someChecked
                  ? "text-gray-700 hover:text-red-600"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={!someChecked}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          {/* Available items (each group/card) */}
          {available.map((it, idx) => (
            <div key={it.id} className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleOne(it.id)}>
                    {it.checked ? (
                      <CheckSquare className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Square className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  <div className="font-semibold">{it.title}</div>
                </div>
                <button
                  onClick={() => delOne(it.id)}
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <hr className="border-gray-200" />

              <div className="px-4 py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Image
                    src={it.img}
                    alt={it.name}
                    width={96}
                    height={96}
                    className="rounded-xl object-cover w-24 h-24"
                  />
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-sm text-gray-500">{it.subtitle}</div>
                  </div>
                </div>

                <div className="text-xl font-semibold">{THB(it.price)}</div>
              </div>
            </div>
          ))}

          {/* Unavailable section */}
          {unavailable.length > 0 && (
            <div className="rounded-xl bg-white shadow-sm opacity-90">
              <div className="flex items-center justify-between px-4 py-3 text-gray-500">
                <div className="font-semibold">Unavailable Item</div>
                <div className="flex items-center gap-4">
                  <button
                    className="inline-flex items-center gap-2 hover:text-red-600"
                    onClick={() =>
                      setItems((prev) => prev.filter((i) => i.available))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    className="inline-flex items-center gap-2 hover:text-purple-700"
                    onClick={() => alert("Moved to wishlist (demo)")}
                  >
                    <Heart className="w-4 h-4" />
                    Move to Wishlist
                  </button>
                </div>
              </div>

              <hr className="border-gray-200" />

              {unavailable.map((it) => (
                <div key={it.id} className="px-4 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Image
                      src={it.img}
                      alt={it.name}
                      width={112}
                      height={84}
                      className="rounded-xl object-cover w-28 h-20"
                    />
                    <div>
                      <div className="font-medium text-gray-700">{it.name}</div>
                      <div className="text-sm text-gray-500">{it.subtitle}</div>
                      <div className="text-sm font-semibold text-rose-600 mt-1">
                        Out of stock
                      </div>
                    </div>
                  </div>

                  <div className="text-xl font-semibold text-gray-400">
                    {THB(it.price)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT: summary */}
        <aside className="h-fit rounded-2xl bg-white shadow-sm p-5">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Subtotal ({available.filter(i=>i.checked).length} items)</dt>
              <dd className="font-semibold">{THB(subtotal)}</dd>
            </div>

            <div className="flex items-center justify-between">
              <dt className="text-gray-600">Shipping Fee</dt>
              <dd className="font-semibold">{THB(shipping)}</dd>
            </div>

            <div>
              <dt className="text-gray-600 mb-2">Discount Code</dt>
              <div className="flex items-center gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Coupon Code"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-400"
                />
                <button
                  onClick={applyCoupon}
                  className="rounded-lg bg-purple-200 text-purple-900 px-3 py-2 font-medium hover:bg-purple-300"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="mt-2 text-sm text-emerald-700">
                  Applied <b>{couponApplied.code}</b> (-{THB(couponApplied.discount)})
                </p>
              )}
            </div>

            <hr className="my-2" />

            <div className="flex items-start justify-between">
              <dt className="text-base font-semibold">Total</dt>
              <dd className="text-xl font-extrabold">{THB(total)}</dd>
            </div>
            <p className="text-[11px] text-gray-500">
              VAT included, where applicable
            </p>
          </dl>

          <button
            disabled={!someChecked}
            className={`mt-4 w-full rounded-lg px-4 py-3 font-semibold ${
              someChecked
                ? "bg-purple-300 text-purple-900 hover:bg-purple-400"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => router.push("/checkout")}
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </main>
  );
}
