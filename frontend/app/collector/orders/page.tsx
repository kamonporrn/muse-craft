"use client";

import Link from "next/link";
import Image from "next/image";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type OrderStatus = "pending" | "processing" | "shipping" | "delivered" | "history";

type OrderLine = {
  id: string;
  product: string;
  desc?: string;
  qty: number;
  unitPrice: number;
  img: string;
};

type Delivery = {
  method: "Standard Delivery" | "Express Delivery";
  name: string;
  phone: string;
  address: string;
};

type ShippingMeta = {
  inTransitLabel?: string;
  courierNotes: string[];
  trackingNumber: string;
  trackingUrl?: string;
  estimateText?: string;
};

type Review = {
  byName: string;
  avatarUrl?: string;
  rating: number; // 0–5
  max?: number;   // default 5
};

type Order = {
  id: string;
  shop: string;
  status: OrderStatus;
  items: OrderLine[];
  shippingFee: number;
  delivery?: Delivery;
  shippingMeta?: ShippingMeta;
  review?: Review;
};

/* ---------------- Mock Data ---------------- */
const INITIAL_ORDERS: Order[] = [
  // Pending
  {
    id: "o-p1",
    shop: "Amazing Pottery",
    status: "pending",
    items: [
      {
        id: "i1",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 360,
        img: "/cart-pottery.jpg",
      },
    ],
    shippingFee: 0,
  },
  {
    id: "o-p2",
    shop: "Amazing E-book",
    status: "pending",
    items: [
      {
        id: "i2",
        product: "What is love?",
        desc: "Romance Novel, E-book",
        qty: 1,
        unitPrice: 1200,
        img: "/cart-ebook.jpg",
      },
    ],
    shippingFee: 0,
  },

  // Processing
  {
    id: "o-x1",
    shop: "Amazing Pottery",
    status: "processing",
    items: [
      {
        id: "i3",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 255,
        img: "/cart-pottery.jpg",
      },
    ],
    shippingFee: 45,
    delivery: {
      method: "Standard Delivery",
      name: "Mr. Somchai Jaidee",
      phone: "+66 81 234 5678",
      address:
        "45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200",
    },
  },
  {
    id: "o-x2",
    shop: "Amazing Pottery",
    status: "processing",
    items: [
      {
        id: "i4",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 180,
        img: "/cart-pottery.jpg",
      },
      {
        id: "i5",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 75,
        img: "/cart-pottery.jpg",
      },
    ],
    shippingFee: 120,
    delivery: {
      method: "Express Delivery",
      name: "Mr. Somchai Jaidee",
      phone: "+66 81 234 5678",
      address:
        "45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200",
    },
  },

  // Shipping
  {
    id: "o-s1",
    shop: "Amazing Pottery",
    status: "shipping",
    items: [
      {
        id: "i6",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 255,
        img: "/cart-pottery.jpg",
      },
    ],
    shippingFee: 45,
    delivery: {
      method: "Standard Delivery",
      name: "Mr. Somchai Jaidee",
      phone: "+66 81 234 5678",
      address:
        "45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200",
    },
    shippingMeta: {
      inTransitLabel: "In Transit",
      courierNotes: [
        "Parcel has been handed over to the courier.",
        "Flash Express – Partner: Songs Kanasriphisiek Taiking Chan Branch.",
      ],
      trackingNumber: "TH2309876543D",
      trackingUrl: "https://www.flashexpress.co.th/tracking/?search=TH2309876543D",
      estimateText: "This delivery should be completed within 5–7 days.",
    },
  },

  // Delivered
  {
    id: "o-d1",
    shop: "Amazing Pottery",
    status: "delivered",
    items: [
      {
        id: "i7",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 255,
        img: "/cart-pottery.jpg",
      },
    ],
    shippingFee: 45,
    delivery: {
      method: "Standard Delivery",
      name: "Mr. Somchai Jaidee",
      phone: "+66 81 234 5678",
      address:
        "45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200",
    },
    shippingMeta: {
      inTransitLabel: "Delivered",
      courierNotes: [
        "Parcel has been successfully delivered.",
        "Flash Express – Partner: Songs Kanasriphisiek Taiking Chan Branch.",
      ],
      trackingNumber: "TH2309876543D",
      trackingUrl: "https://www.flashexpress.co.th/tracking/?search=TH2309876543D",
      estimateText: "This delivery should be completed within 5–7 days.",
    },
  },

  // History
  {
    id: "o-h1",
    shop: "Amazing Pottery",
    status: "history",
    items: [
      {
        id: "ih1",
        product: "Blue-and-white porcelain vase",
        desc: "21 CM, Premium ceramic",
        qty: 1,
        unitPrice: 255,
        img: "/clock.jpg",
      },
    ],
    shippingFee: 45,
    delivery: {
      method: "Standard Delivery",
      name: "Mr. Somchai Jaidee",
      phone: "+66 81 234 5678",
      address:
        "45/12 Nimmanhaemin Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200",
    },
    shippingMeta: {
      inTransitLabel: "Delivered",
      courierNotes: [
        "Parcel has been successfully delivered.",
        "Flash Express – Partner: Songs Kanasriphisiek Taiking Chan Branch.",
      ],
      trackingNumber: "TH2309876543D",
      trackingUrl:
        "https://www.flashexpress.co.th/tracking/?search=TH2309876543D",
      estimateText: "This delivery should be completed within 5–7 days.",
    },
    review: {
      byName: "Mr. Somchai Jaodee",
      avatarUrl: "/avatar.jpeg",
      rating: 5,
      max: 5,
    },
  },
];

const TABS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending Payment" },
  { key: "processing", label: "Processing" },
  { key: "shipping", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
  { key: "history", label: "Order History" },
];

const CURRENT_USER = "Mr. Somchai Jaodee";

/* ---------------- Page ---------------- */
export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<OrderStatus>("shipping");
  const [ordersState, setOrdersState] = useState<Order[]>(INITIAL_ORDERS);

  // rating modal state
  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);

  function openRating(order: Order) {
    setRatingOrder(order);
    setRatingValue(order.review?.rating ?? 0);
    setRatingOpen(true);
  }
  function closeRating() {
    setRatingOpen(false);
    setRatingOrder(null);
    setRatingValue(0);
  }
  function submitRating() {
    if (!ratingOrder) return;
    setOrdersState(prev =>
      prev.map(o =>
        o.id === ratingOrder.id
          ? {
              ...o,
              status: o.status === "delivered" ? "history" : o.status,
              review: {
                byName: CURRENT_USER,
                rating: ratingValue,
                max: 5,
                avatarUrl: "/avatar.jpeg",
              },
            }
          : o
      )
    );
    closeRating();
  }

  const orders = useMemo(
    () => ordersState.filter((o) => o.status === active),
    [ordersState, active]
  );

  const confirmReceipt = (orderId: string) => {
    setOrdersState(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: "delivered" } : o))
    );
    alert("Thanks! Order has been marked as delivered.");
  };

  return (
    <main className="min-h-screen bg-[#f3e8ff] text-gray-900">
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={(q) =>
          router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
        }
        user={{ name: "Somchai", avatarUrl: "/avatar.jpeg" }}
        cartCount="10+"
      />

      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-lg mb-3">Manage My Account</h3>
          <nav className="space-y-1">
            <Link href="/account" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Profile
            </Link>
            <Link href="/account/address" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              Address Book
            </Link>
            <Link href="/account/payments" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Payment Options
            </Link>
          </nav>

          <h3 className="font-bold text-lg mt-5 mb-3">Manage My Order</h3>
          <nav className="space-y-1">
            <Link href="/orders" className="block rounded-md px-3 py-2 bg-purple-50 text-purple-700">
              My Order
            </Link>
            <Link href="/cart" className="block rounded-md px-3 py-2 hover:bg-gray-50">
              My Cart
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">My Orders</h2>
          </div>

          {/* Tabs */}
          <div className="mt-4 mb-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  active === t.key
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <BlankState status={active} />
            ) : (
              orders.map((o) =>
                active === "pending" ? (
                  <PendingCard key={o.id} order={o} />
                ) : (
                  <FulfillmentCard
                    key={o.id}
                    order={o}
                    onConfirm={() => confirmReceipt(o.id)}
                    onRate={() => openRating(o)}
                  />
                )
              )
            )}
          </div>
        </section>
      </div>

      {/* Rating Modal */}
      {ratingOpen && ratingOrder && (
        <RatingModal
          order={ratingOrder}
          value={ratingValue}
          onChange={setRatingValue}
          onClose={closeRating}
          onSubmit={submitRating}
        />
      )}
    </main>
  );
}

/* ---------------- Cards ---------------- */

// Pending
function PendingCard({ order }: { order: Order }) {
  const item = order.items[0];
  const amount = item.unitPrice * item.qty;

  return (
    <article className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-semibold">{order.shop}</h4>
        <span className="text-sm text-gray-500">Pending Payment</span>
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-md bg-gray-100 overflow-hidden grid place-items-center">
            <Image src={item.img} alt={item.product} width={64} height={64} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{item.product}</div>
            {item.desc && <div className="text-xs text-gray-500">{item.desc}</div>}
            <div className="text-xs text-gray-500">x {item.qty}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-800">฿{formatTHB(item.unitPrice)}</div>
          <hr className="my-3" />
          <div className="text-sm">
            Amount Payable:{" "}
            <span className="font-semibold text-purple-700">฿{formatTHB(amount)}</span>
          </div>
          <button
            className="mt-3 rounded-md bg-purple-600 px-4 py-2 text-white text-sm font-semibold hover:bg-purple-700"
            onClick={() => alert(`Paying ${item.product} (฿${formatTHB(amount)})`)}
          >
            Pay Now
          </button>
        </div>
      </div>
    </article>
  );
}

// Processing / Shipping / Delivered / History
function FulfillmentCard({
  order,
  onConfirm,
  onRate,
}: {
  order: Order;
  onConfirm?: () => void;
  onRate?: () => void;
}) {
  const merchandiseSubtotal = order.items.reduce(
    (s, it) => s + it.unitPrice * it.qty,
    0
  );
  const orderTotal = merchandiseSubtotal + order.shippingFee;

  const isShipping = order.status === "shipping";
  const isDelivered = order.status === "delivered";
  const isHistory = order.status === "history";
  const shipping = order.shippingMeta;

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-semibold">{order.shop}</h4>
        <span className="text-sm text-gray-500">
          {isShipping ? shipping?.inTransitLabel ?? "Shipping" : isDelivered || isHistory ? "Delivered" : capitalize(order.status)}
        </span>
      </div>

      {/* Lines */}
      <div className="mt-3 space-y-3">
        {order.items.map((it) => (
          <div
            key={it.id}
            className="grid grid-cols-[auto_1fr_auto] items-start gap-3 border-b border-gray-200 pb-3"
          >
            <div className="h-14 w-14 rounded-md bg-gray-100 overflow-hidden grid place-items-center">
              <Image src={it.img} alt={it.product} width={56} height={56} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{it.product}</div>
              {it.desc && <div className="text-xs text-gray-500">{it.desc}</div>}
              <div className="text-xs text-gray-500">x {it.qty}</div>
            </div>
            <div className="text-sm text-gray-800">฿{formatTHB(it.unitPrice)}</div>
          </div>
        ))}
      </div>

      {/* Tracking / Status panel */}
      {(isShipping || isDelivered || isHistory) && shipping && (
        <div className="mt-3 space-y-2">
          {(isDelivered || isHistory) && (
            <div className="rounded-md bg-purple-100 px-3 py-2 text-xs font-semibold text-gray-700">
              Parcel has been successfully delivered.
            </div>
          )}

          <div className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
            {shipping.courierNotes.map((l, idx) => (
              <p key={idx} className={idx === 0 ? "" : "mt-1"}>
                {l}
              </p>
            ))}
          </div>

          <div className="rounded-md bg-purple-50 px-3 py-2 text-xs">
            <span className="mr-1 text-gray-700">Tracking No.</span>
            {shipping.trackingUrl ? (
              <a
                className="underline text-purple-700 break-all"
                href={shipping.trackingUrl}
                target="_blank"
                rel="noreferrer"
              >
                {shipping.trackingNumber}
              </a>
            ) : (
              <span className="text-purple-700">{shipping.trackingNumber}</span>
            )}
          </div>

          {shipping.estimateText && (
            <div className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-700">
              {shipping.estimateText}
            </div>
          )}
        </div>
      )}

      {/* Delivery badge */}
      {order.delivery && (
        <div className="mt-3 inline-flex max-w-full rounded-lg bg-purple-50 px-3 py-2 text-xs text-gray-700">
          <div className="font-semibold mr-3">{order.delivery.method}</div>
          <div className="truncate">
            {order.delivery.name} | {order.delivery.phone}
            <br className="hidden md:block" />
            {order.delivery.address}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Merchandise Subtotal:</span>
          <span>฿{formatTHB(merchandiseSubtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping Fee:</span>
          <span>฿{formatTHB(order.shippingFee)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Order Total:</span>
          <span className="text-purple-700">฿{formatTHB(orderTotal)}</span>
        </div>
      </div>

      {/* Bottom bar */}
      {isShipping && (
        <div className="mt-4 flex items-center justify-between gap-3 border-top border-gray-200 pt-3">
          <p className="text-xs text-gray-600">
            Please confirm receipt if you have received your order.
          </p>
          <button
            className="rounded-md bg-purple-600 px-4 py-2 text-white text-sm font-semibold hover:bg-purple-700"
            onClick={onConfirm}
          >
            Confirm Receipt
          </button>
        </div>
      )}

      {isDelivered && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
          <div className="text-xs text-gray-600">
            <p className="font-medium">Are you satisfied with the product?</p>
            <p>Share your feedback by rating this product.</p>
          </div>
          <button
            className="rounded-md bg-purple-600 px-4 py-2 text-white text-sm font-semibold hover:bg-purple-700"
            onClick={onRate}
          >
            Rate this product
          </button>
        </div>
      )}

      {/* History footer: avatar + name + rating */}
      {isHistory && order.review && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
              {order.review.avatarUrl ? (
                <Image
                  src={order.review.avatarUrl}
                  alt={order.review.byName}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <span className="text-sm text-gray-800">{order.review.byName}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5">
            <StarRating value={order.review.rating} max={order.review.max ?? 5} />
            <span className="text-sm font-semibold text-gray-700">
              {order.review.rating}/{order.review.max ?? 5}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

/* ---------------- Rating widgets & Modal ---------------- */
function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < value ? "fill-yellow-400" : "fill-gray-300"}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15.27l-5.18 3.05 1.4-5.9L1 7.97l6-.52L10 2l3 5.45 6 .52-5.22 4.45 1.4 5.9z" />
        </svg>
      ))}
    </div>
  );
}

function RatingModal({
  order,
  value,
  onChange,
  onClose,
  onSubmit,
}: {
  order: Order;
  value: number;
  onChange: (n: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const item = order.items[0];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-bold">Rate the product</h3>
          <button aria-label="Close" className="rounded-full p-2 hover:bg-gray-100" onClick={onClose}>
            ✕
          </button>
        </div>

        <hr />

        <div className="px-5 py-4">
          <div className="text-sm font-semibold mb-3">{order.shop}</div>

          <div className="flex gap-3">
            <div className="h-14 w-14 rounded-md bg-gray-100 overflow-hidden grid place-items-center shrink-0">
              <Image src={item.img} alt={item.product} width={56} height={56} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{item.product}</div>
              {item.desc && <div className="text-xs text-gray-500 truncate">{item.desc}</div>}
              <div className="text-xs text-gray-500">x {item.qty}</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-purple-100 grid place-items-center text-purple-600">
                <span className="text-lg">👤</span>
              </div>
              <div className="text-sm font-medium text-gray-800 truncate">
                {order.review?.byName ?? CURRENT_USER}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <StarPicker value={value} onChange={onChange} />
              <span className="text-sm text-gray-600">{value}/5</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4">
          <button className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rounded-md bg-purple-600 px-4 py-2 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
            disabled={value === 0}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function StarPicker({
  value,
  onChange,
  max = 5,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value;

  return (
    <div className="flex items-center">
      {Array.from({ length: max }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= active;
        return (
          <button
            key={idx}
            type="button"
            aria-label={`Rate ${idx}`}
            className="p-1"
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(idx)}
          >
            <svg viewBox="0 0 20 20" className={`h-6 w-6 ${filled ? "fill-yellow-400" : "fill-gray-300"}`}>
              <path d="M10 15.27l-5.18 3.05 1.4-5.9L1 7.97l6-.52L10 2l3 5.45 6 .52-5.22 4.45 1.4 5.9z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Misc ---------------- */
function BlankState({ status }: { status: OrderStatus }) {
  const label = TABS.find((t) => t.key === status)?.label ?? "Orders";
  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
      <p className="text-sm text-gray-600">No items in “{label}”.</p>
    </div>
  );
}

function formatTHB(n: number) {
  return n.toLocaleString("th-TH");
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
