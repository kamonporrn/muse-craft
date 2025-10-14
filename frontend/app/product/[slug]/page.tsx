// app/product/[slug]/page.tsx
"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getProductBySlug } from "@/lib/products";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [search, setSearch] = useState("");

  const product = useMemo(() => getProductBySlug(slug as string), [slug]);
  if (!product) return notFound();

  const { name, author, price, rating, img, category } = product;

  function addToCart() {
    console.log("Add to cart:", name);
  }

  return (
    <main className="min-h-screen bg-purple-100 text-gray-900">
      <Navbar search={search} onSearchChange={setSearch} />

      <h1 className="mx-auto max-w-6xl px-6 py-6 text-center text-4xl font-extrabold">
        {name}
      </h1>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-16 md:grid-cols-[520px_1fr]">
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
              className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 active:translate-y-[1px]"
            >
              Add cart
            </button>
            <span className="rounded-md bg-green-200 px-4 py-2 font-bold text-green-800 shadow">
              {price.toLocaleString("en-US", { minimumFractionDigits: 2 })} ฿
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 h-3 w-full rounded-sm bg-gray-300/60" />
        <h2 className="mb-3 text-3xl font-bold">Description</h2>
        <p className="text-gray-800">
          Handcrafted {name} designed by {author}. Explore more works in {category}.
        </p>
      </section>
    </main>
  );
}
