"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function AuctionCreatePage() {
  const [showRules, setShowRules] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    price: "",
    bidStep: 100,
    picture: null as File | null,
    time: { d: "00", h: "00", m: "00", s: "00" },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-[#F4F4F4]">
      {/* 🔹 Auction Rules Popup */}
      {showRules && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[800px] relative">
            <h2 className="text-xl font-bold mb-4">Auction Rules</h2>
            <div className="text-sm text-gray-700 space-y-3 max-h-[60vh] overflow-y-auto leading-relaxed">
              <p>
                <strong>1. Purpose</strong><br />
                This auction is organized to support artists and promote artworks under the Muse Craft brand.
                All proceeds from the auction will be distributed according to the defined revenue sharing policy.
              </p>
              <p>
                <strong>2. Participation Requirements</strong><br />
                • Participants must register before joining the auction.<br />
                • Each auction will begin at a starting price set by the artist or organizer.<br />
                • Each new bid must be at least 1% higher than the current highest bid.<br />
                • When the auction ends, the highest bidder will be declared the winner.
              </p>
              <p>
                <strong>3. Payment Terms</strong><br />
                • The winning bidder must complete payment within 3 business days after the result announcement.<br />
                • Failure to make payment within the specified period may result in forfeiture, and the item may be offered to the next highest bidder.
              </p>
              <p>
                <strong>4. Revenue Distribution</strong><br />
                After deducting applicable fees or taxes, the revenue will be distributed as follows:
              </p>
              <ul className="pl-5 list-disc">
                <li>Auction Platform: 10% — system operation and management fee</li>
                <li>Muse Craft: 15% — administrative and promotional expenses</li>
                <li>Artist: 50% — direct income for the creator of the artwork</li>
                <li>Others/Fund/Tax: 25% — reserved for community or legal obligations</li>
              </ul>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowRules(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg shadow-md transition"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Auction Form */}
      {!showRules && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-10 w-[950px] mx-auto"
        >
          <div className="grid grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Auction Item</label>
                <input
                  type="text"
                  placeholder="Enter auction item name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* 🔹 Time limit with 'days' */}
              <div>
                <label className="block text-sm font-semibold mb-1">Auction Duration</label>
                <div className="flex items-center gap-2">
                  {["d", "h", "m", "s"].map((t) => (
                    <div key={t} className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={form.time[t as "d" | "h" | "m" | "s"]}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            time: { ...form.time, [t]: e.target.value },
                          })
                        }
                        className="w-16 text-center border border-gray-300 rounded-md py-2"
                      />
                      <span className="text-gray-600 ml-1 text-sm">
                        {t === "d"
                          ? "D"
                          : t === "h"
                          ? "H"
                          : t === "m"
                          ? "M"
                          : "S"}
                      </span>
                      {t !== "s" && <span className="mx-1">:</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Starting Bid (Baht)
                </label>
                <input
                  type="number"
                  placeholder="Enter starting bid price"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Suggested Bids</label>
                <div className="flex gap-3 mt-1">
                  {[1, 10, 100, 1000].map((bid) => (
                    <button
                      key={bid}
                      type="button"
                      onClick={() => setForm({ ...form, bidStep: bid })}
                      className={`px-5 py-2 rounded-md border shadow-sm transition ${
                        form.bidStep === bid
                          ? "bg-[#8000FF] text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {bid}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Enter your description"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Doate</label>
                <input
                  type="text"
                  placeholder="Enter donation amount"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Upload Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 hover:bg-gray-50 transition">
                  <p className="text-sm">
                    Drag & Drop or Choose an Image to Upload
                  </p>
                  <div className="text-4xl mt-3">⬇️</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        picture: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end mt-10">
            <button
              type="submit"
              className="bg-[#8000FF] hover:bg-purple-700 text-white px-10 py-2 rounded-lg shadow-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
