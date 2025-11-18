"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { fetchProducts, updateProductStatus, type ApiProduct } from "@/lib/api";

/* ---------- Types ---------- */
type Status = "Waiting for approval" | "Approved" | "Rejected";
type ProdType = "Sell";
type Category =
  | "Painting"
  | "Sculpture"
  | "Literature (E-book)"
  | "Graphic Design"
  | "Crafts"
  | "Digital Art";

type Item = {
  id: string;
  productSlug: string;
  title: string;
  creator: string;
  category: Category;
  prodType: ProdType;
  price: number;
  createdAt: string;
  status: Status;
  image: string;
  description?: string;
};

// Convert API product to Item
function apiProductToItem(p: ApiProduct): Item {
  const slug = p.name.toLowerCase().replace(/\s+/g, '-');
  const statusMap: Record<string, Status> = {
    "pending": "Waiting for approval",
    "approved": "Approved",
    "rejected": "Rejected",
  };
  return {
    id: p.id,
    productSlug: slug,
    title: p.name,
    creator: p.author,
    category: p.category as Category,
    prodType: "Sell",
    price: p.price,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    status: statusMap[p.status || "pending"] || "Waiting for approval",
    image: p.img,
    description: p.description || `${p.author} — ${p.name}`,
  };
}

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export default function AdminArtworksPage() {
  // ===== Guard: admin เท่านั้น =====
  const [ok, setOk] = useState(false);
  const [userName, setUserName] = useState("Admin01");
  useEffect(() => {
    try {
      const role = localStorage.getItem("musecraft.role");
      const name = localStorage.getItem("musecraft.userName") || "Admin01";
      setUserName(name);
      if (role === "admin") setOk(true);
      else window.location.replace("/signin");
    } catch {
      window.location.replace("/signin");
    }
  }, []);

  // Load products from API
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setItems(products.map(apiProductToItem));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  /* ---------- Filters ---------- */
  const [q, setQ] = useState("");
  const [fCategory, setFCategory] = useState<"All" | Category>("All");
  const [fStatus, setFStatus] = useState<"All" | Status>("Waiting for approval");
  const [fType, setFType] = useState<"All" | ProdType>("All");
  const [fDate, setFDate] = useState("");

  const categoryOptions = useMemo(() => {
    // unique categories from items
    return Array.from(new Set(items.map((it) => it.category))) as Category[];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      // Hide cards that are fading out
      if (fadingOut.has(it.id)) return false;
      
      if (fCategory !== "All" && it.category !== fCategory) return false;
      if (fStatus !== "All" && it.status !== fStatus) return false;
      if (fType !== "All" && it.prodType !== fType) return false;
      if (fDate && it.createdAt !== fDate) return false;
      if (q) {
        const key = (it.title + " " + it.creator).toLowerCase();
        if (!key.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [items, fCategory, fStatus, fType, fDate, q, fadingOut]);

  const approve = async (id: string) => {
    try {
      console.log(`Approving product with id: ${id}`);
      // Start fade out animation
      setFadingOut(prev => new Set(prev).add(id));
      
      // Wait for fade animation (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updated = await updateProductStatus(id, "approved");
      if (updated) {
        // Remove from fadingOut and reload products
        setFadingOut(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        // Reload products to get fresh data
        const products = await fetchProducts();
        setItems(products.map(apiProductToItem));
        console.log(`Product ${id} approved successfully`);
      } else {
        // Cancel fade out on error
        setFadingOut(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        alert("Failed to approve product. Product not found or update failed.");
      }
    } catch (error) {
      // Cancel fade out on error
      setFadingOut(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      console.error('Error approving product:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to approve product: ${errorMessage}`);
    }
  };
  const reject = async (id: string) => {
    try {
      console.log(`Rejecting product with id: ${id}`);
      // Start fade out animation
      setFadingOut(prev => new Set(prev).add(id));
      
      // Wait for fade animation (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updated = await updateProductStatus(id, "rejected");
      if (updated) {
        // Remove from fadingOut and reload products
        setFadingOut(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        // Reload products to get fresh data
        const products = await fetchProducts();
        setItems(products.map(apiProductToItem));
        console.log(`Product ${id} rejected successfully`);
      } else {
        // Cancel fade out on error
        setFadingOut(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        alert("Failed to reject product. Product not found or update failed.");
      }
    } catch (error) {
      // Cancel fade out on error
      setFadingOut(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      console.error('Error rejecting product:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to reject product: ${errorMessage}`);
    }
  };

  if (!ok) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#efe2fb] text-gray-700">
        Checking permission…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efe2fb]">
      <AdminNavbar userName={userName} />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Artworks Management</h1>

        {/* Filters */}
        <section className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-purple-100 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {/* Category */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">Category</div>
              <select
                value={fCategory}
                onChange={(e) => setFCategory(e.target.value as any)}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-400 focus:outline-none"
                aria-label="Filter by category"
              >
                <option>All</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">Date</div>
              <input
                type="date"
                value={fDate}
                onChange={(e) => setFDate(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-400 focus:outline-none"
                aria-label="Filter by date"
              />
            </div>

            {/* Status */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">Status</div>
              <select
                value={fStatus}
                onChange={(e) => setFStatus(e.target.value as any)}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-400 focus:outline-none"
                aria-label="Filter by status"
              >
                <option>All</option>
                <option>Waiting for approval</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            {/* Type of product */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">Type of product</div>
              <select
                value={fType}
                onChange={(e) => setFType(e.target.value as any)}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-purple-400 focus:outline-none"
                aria-label="Filter by product type"
              >
                <option>All</option>
                <option>Sell</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-700">Search</div>
              <div className="flex items-center rounded-full border border-gray-200 bg-white px-3 py-2.5 focus-within:border-purple-400">
                <Search className="mr-2 h-4 w-4 text-purple-600" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-gray-800 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="mt-5 space-y-4">
          {filtered.map((it) => (
            <article 
              key={it.id} 
              className={`rounded-2xl bg-white p-4 ring-1 ring-purple-100 shadow-sm transition-opacity duration-300 ${
                fadingOut.has(it.id) ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="grid grid-cols-[96px_1fr_auto] gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-xl ring-1 ring-black/5">
                  <Image src={it.image} alt={it.title} width={192} height={192} className="h-full w-full object-cover" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                      {it.category}
                    </span>
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                      Sell
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Creator — <span className="font-medium">{it.creator}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700">{it.description || "—"}</p>

                  <div className="mt-2 text-sm text-gray-800">
                    <span className="text-gray-500">Starting Price</span>{" "}
                    <span className="font-semibold">฿{it.price}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-gray-500">{fmtDate(it.createdAt)}</div>
                  {/* Only show buttons if status is "Waiting for approval" */}
                  {it.status === "Waiting for approval" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(it.id)}
                        className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-200"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => reject(it.id)}
                        className="rounded-full bg-rose-100 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-200"
                      >
                        ✗ Disapprove
                      </button>
                    </div>
                  )}


                  <span
                    className={[
                      "mt-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      it.status === "Approved" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                      it.status === "Rejected" && "bg-rose-50 text-rose-700 border border-rose-200",
                      it.status === "Waiting for approval" && "bg-amber-50 text-amber-700 border border-amber-200",
                    ].join(" ")}
                  >
                    {it.status}
                  </span>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center text-gray-600 ring-1 ring-purple-100">
              No artworks match your filters.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
