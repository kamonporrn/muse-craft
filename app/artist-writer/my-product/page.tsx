"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link
import { FaSearch, FaBox, FaTags, FaImage, FaClock } from "react-icons/fa";

export default function Page() {
  const [activeTab, setActiveTab] = useState("Live");

  const tabs = [
    { name: "Live", count: 1 },
    { name: "Sold Out", count: 1 },
    { name: "In Progress", count: 1 },
    { name: "Auction", count: 3 },
    { name: "Violation", count: 1 },
  ];

  const products = [
    { id: 1, title: "Mountain", type: "Portrait", price: "฿4,000", stock: 2, sold: 90, status: "Live", image: "/img/mountain1.jpg" },
    { id: 2, title: "Flower Vase", type: "Portrait", price: "฿1,000", stock: 0, sold: 2, status: "Sold Out", image: "/img/soldout1.jpg" },
    { id: 3, title: "Spring Meadow in Van Gogh", type: "Portrait", price: "฿4,000", stock: 2, sold: 0, status: "In Progress", image: "/img/mountain2.jpg" },
    { id: 4, title: "Obsessed with Judas", type: "Portrait", event: "Amore de Thailandia", startPrice: "฿70,000", price: "฿100,000", status: "Auction", auctionStatus: "In Auction", image: "/img/auction1.jpg" },
    { id: 5, title: "Cinnamon in The Heven", type: "Portrait", event: "Amore de Thailandia", startPrice: "฿80,000", price: "฿950,000", status: "Auction", auctionStatus: "Event Ended", image: "/img/auction1.jpg" },
    { id: 6, title: "Shin", type: "Portrait", event: "Resanance 2026", startPrice: "฿200,000", price: "฿200,000", status: "Auction", auctionStatus: "Coming Soon", image: "/img/auction1.jpg" },
    { id: 7, title: "Inlay", type: "Portrait", price: "฿4,000", stock: 2, sold: 90, status: "Violation", image: "/img/violation1.jpg" },
  ];

  const filteredProducts = products.filter((product) => product.status === activeTab);

  return (
    <div className="min-h-screen bg-[#f4eafa] flex">
      <main className="flex-1 -ml-40 pr-6 pt-4 pb-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">My Product</h1>
           <Link href="/artist-writer/add-new-product">
            <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
              Add New Product
            </button>
          </Link>
        </div>

        {/* Search + Tabs */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl shadow-sm p-3 mb-4 flex items-center gap-2">
            <FaSearch className="text-purple-500" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex justify-between border-b border-gray-200 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`pb-2 px-2 font-medium cursor-pointer ${
                  activeTab === tab.name
                    ? "text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <FaImage size={24} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">{product.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md inline-flex items-center gap-1">
                    <FaImage className="text-blue-500" /> {product.type}
                  </span>

                  {product.status === "Auction" ? (
                    <>
                      <p className="mt-1 text-sm text-gray-600">
                        Event: <span className="font-medium">{product.event}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Start Price: <span className="font-medium">{product.startPrice}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Current Price: <span className="font-medium">{product.price}</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 font-semibold text-gray-800">{product.price}</p>
                      <div className="flex gap-6 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FaBox /> Stock {product.stock}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaTags /> Sold {product.sold}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              {activeTab === "Auction" ? (
                <div>
                  {product.auctionStatus === "In Auction" && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-medium">
                      In Auction
                    </span>
                  )}
                  {product.auctionStatus === "Event Ended" && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-lg font-medium">
                      Event Ended
                    </span>
                  )}
                  {product.auctionStatus === "Waiting for Confirmation" && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-lg font-medium">
                      Waiting for Confirmation
                    </span>
                  )}
                  {product.auctionStatus === "Coming Soon" && (
                    <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              ) : activeTab === "In Progress" ? (
                <p className="text-sm text-yellow-500 font-medium flex items-center gap-1">
                  <FaClock className="text-yellow-400" /> Waiting for Confirmation
                </p>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-100">
                    Edit
                  </button>
                  <button className="border border-red-400 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
