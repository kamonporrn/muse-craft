// app/product/[slug]/page.tsx
"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/NavbarSignedIn";
import { getProductBySlug, toSlug } from "@/lib/products";
import NavbarSignedIn from "@/components/NavbarSignedIn";

type CartItem = {
  slug: string;
  name: string;
  price: number;
  img: string;
  qty: number;
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [search, setSearch] = useState("");

  const product = useMemo(() => getProductBySlug(slug as string), [slug]);
  if (!product) return notFound();

  const { name, author, price, rating, img, category } = product;

  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<null | string>(null);

  function addToCart() {
    try {
      setAdding(true);

      // read existing cart
      const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];

      const itemSlug = toSlug(name);
      const idx = cart.findIndex((c) => c.slug === itemSlug);

      if (idx >= 0) {
        cart[idx].qty += 1;
      } else {
        cart.push({
          slug: itemSlug,
          name,
          price,
          img,
          qty: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // show toast
      setToast("Added to cart");
      setTimeout(() => setToast(null), 1800);
    } catch (e) {
      console.error(e);
      setToast("Failed to add to cart");
      setTimeout(() => setToast(null), 1800);
    } finally {
      setAdding(false);
    }
  }

  return (
    <main className="min-h-screen bg-purple-100 text-gray-900">
      <NavbarSignedIn
        search={search}
        onSearchChange={setSearch}
        user={{ name: "Guest User" }}
      />

      <h1 className="mx-auto max-w-6xl px-6 py-6 text-center text-4xl font-extrabold">
        {name}
      </h1>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 md:grid-cols-[520px_1fr]">
        {/* Product image */}
        <div className="flex justify-center">
          <Image
            src={img}
            alt={name}
            width={520}
            height={520}
            priority
            className="rounded-lg shadow object-cover"
          />
        </div>

        {/* Right info */}
        <div className="text-lg">
          <dl className="grid grid-cols-[140px_1fr] gap-y-3">
            <dt className="font-semibold text-gray-700">Designer</dt>
            <dd className="text-purple-700 font-semibold">{author}</dd>

            <dt className="font-semibold text-gray-700">Category</dt>
            <dd className="text-purple-700 font-semibold">{category}</dd>

            <dt className="font-semibold mt-2">Ranking</dt>
            <dd className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-1 text-purple-600">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rating ? "fill-purple-500 text-purple-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700">(20)</span>
            </dd>

            <dt className="font-semibold mt-4 text-gray-700">Type</dt>
            <dd className="mt-4 text-gray-700">{category}</dd>

            <dt className="font-semibold text-gray-700">On sale</dt>
            <dd className="text-gray-700">8/9/2024</dd>
          </dl>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={addToCart}
              disabled={adding}
              className={`rounded-md px-4 py-2 text-white shadow active:translate-y-[1px] ${
                adding ? "bg-green-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {adding ? "Adding..." : "Add cart"}
            </button>
            <span className="rounded-md bg-green-200 px-4 py-2 font-bold text-green-800 shadow">
              {price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
            </span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 h-3 w-full rounded-sm bg-gray-300/60" />
        <h2 className="mb-3 text-3xl font-bold">Description</h2>
        <p className="text-gray-800">
          Handcrafted {name} designed by {author}. Explore more works in {category}.
        </p>
      </section>

      {/* Toast */}
      <div aria-live="polite" className="fixed inset-0 z-50 pointer-events-none">
        {toast && (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="
                pointer-events-auto
                flex flex-col items-center justify-center
                gap-3
                rounded-2xl
                bg-green-100
                text-green-500
                px-10 py-8
                shadow-2xl
                text-2xl font-bold
                tracking-wide
                ring-4 ring-green-500/50
                animate-[fadeIn_.2s_ease-out]
              "
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-14 h-14 text-green-500 mb-1'
              >
                <path
                  fillRule='evenodd'
                  d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.72a.75.75 0 1 0-1.06-1.06l-4.72 4.72-2.12-2.12a.75.75 0 1 0-1.06 1.06l2.65 2.65a.75.75 0 0 0 1.06 0l5.25-5.25z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{toast}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
