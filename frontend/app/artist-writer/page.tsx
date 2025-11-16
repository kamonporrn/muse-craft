"use client";

import {
  FaStore,
  FaGavel,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaUndo,
} from "react-icons/fa";

export default function ArtistWriterHome() {
  return (
    <div className="flex min-h-screen bg-[#f4eafa] text-gray-800">
      {/* Main Content */}
      <div className="flex-1 -ml-40 pr-6 pt-4 pb-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Home</h2>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-6">
            <div className="flex items-center gap-4 pl-2">
              <img
                src="/img/profile1.jpg"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold text-lg">Sophia Mitchell</h3>
                <p className="text-sm text-gray-500">Joined 2020</p>
              </div>
            </div>
          </div>

          <div className="flex gap-8 mt-6 flex-wrap pl-2">
            <div className="text-center">
              <h4 className="text-2xl font-bold">30</h4>
              <p className="text-gray-500 text-sm">Products</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold">100</h4>
              <p className="text-gray-500 text-sm">Total Sales</p>
            </div>
            <div className="text-center">
              <h4 className="text-2xl font-bold">58</h4>
              <p className="text-gray-500 text-sm">Customers</p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Order Status</h3>
            <a
              href="#"
              className="text-purple-600 text-sm font-medium hover:underline"
            >
              View Sales History &gt;
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaClock className="text-yellow-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-yellow-500">6</span>
              <p className="text-sm text-gray-700 mt-2">To Confirm</p>
              <p className="text-xs text-gray-400">Orders in queue</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaTruck className="text-blue-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-blue-500">3</span>
              <p className="text-sm text-gray-700 mt-2">To Ship</p>
              <p className="text-xs text-gray-400">Ready for shipment</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaTimesCircle className="text-red-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-red-500">2</span>
              <p className="text-sm text-gray-700 mt-2">Canceled</p>
              <p className="text-xs text-gray-400">Canceled orders</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaUndo className="text-yellow-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-yellow-500">1</span>
              <p className="text-sm text-gray-700 mt-2">Return</p>
              <p className="text-xs text-gray-400">Return requests</p>
            </div>
          </div>
        </div>

        {/* Sales Dashboard */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Sales Dashboard</h3>
            <p className="text-sm text-gray-500">January Sales</p>
          </div>

          <div className="relative w-full h-72 bg-white border border-gray-100 rounded-xl p-4">
            <div className="absolute inset-0 flex flex-col justify-between py-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full border-t border-dashed border-gray-200"
                ></div>
              ))}
            </div>

            <svg
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 w-full h-full"
            >
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M0,150 C50,120 100,80 150,100 C200,120 250,60 300,90 C350,130 400,70 450,100 C480,110 500,90 500,200 L0,200 Z"
                fill="url(#purpleGradient)"
                stroke="#9333ea"
                strokeWidth="2"
              />
            </svg>

            <div className="absolute bottom-2 left-0 right-0 flex justify-around text-xs text-gray-400">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
            </div>

            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
              <span>10k</span>
              <span>7.5k</span>
              <span>5k</span>
              <span>2.5k</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}