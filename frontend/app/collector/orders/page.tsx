"use client";

import Link from "next/link";
import Image from "next/image";
import NavbarSignedIn from "@/components/NavbarSignedIn";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

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

type Order = {
  id: string;
  shop: string;
  status: OrderStatus;
  items: OrderLine[];
  shippingFee: number;
  delivery?: Delivery;
  shippingMeta?: ShippingMeta;
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

  // Check if user is signed in - redirect to login if not
  useEffect(() => {
    if (typeof window !== "undefined") {
      const signedIn = localStorage.getItem("musecraft.signedIn") === "true";
      if (!signedIn) {
        router.push("/signin");
      }
    }
  }, [router]);


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

  const handlePayment = async (orderId: string) => {
    // Update order status to processing when payment is made
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' }), // confirmed = processing for collector, to confirm for artist
      });
      if (response.ok) {
        // Update local state
        setOrdersState(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: "processing" } : o))
        );
        alert(`Payment successful! Order is now processing.`);
      } else {
        alert(`Payment failed. Please try again.`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Payment failed. Please try again.`);
    }
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
                  <PendingCard key={o.id} order={o} onPay={handlePayment} />
                ) : (
                  <FulfillmentCard
                    key={o.id}
                    order={o}
                    onConfirm={() => confirmReceipt(o.id)}
                  />
                )
              )
            )}
          </div>
        </section>
      </div>

    </main>
  );
}

/* ---------------- Cards ---------------- */

// Pending
function PendingCard({ order, onPay }: { order: Order; onPay?: (orderId: string) => void }) {
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
            onClick={() => {
              if (onPay) {
                onPay(order.id);
              } else {
                alert(`Paying ${item.product} (฿${formatTHB(amount)})`);
              }
            }}
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
}: {
  order: Order;
  onConfirm?: () => void;
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

    </article>
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
