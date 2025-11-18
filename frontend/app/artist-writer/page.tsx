"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaStore,
  FaGavel,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaBox,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";
import { fetchCurrentUser, fetchOrdersByCreator, fetchProductsByAuthor, type ApiUser, type ApiOrder, type ApiProduct } from "@/lib/api";

// Calculate sales data from actual orders
const calculateSalesData = (orders: ApiOrder[], year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Only count completed orders (delivered or shipped)
  const completedOrders = orders.filter(o => 
    o && (o.status === "delivered" || o.status === "shipped")
  );
  
  // Initialize sales data for all days in the month
  const dailySales: Record<number, number> = {};
  for (let day = 1; day <= daysInMonth; day++) {
    dailySales[day] = 0;
  }
  
  // Calculate revenue for each day from orders
  completedOrders.forEach(order => {
    if (!order.dateISO) return;
    const orderDate = new Date(order.dateISO);
    
    // Check if order is in the selected month/year
    if (orderDate.getFullYear() === year && orderDate.getMonth() + 1 === month) {
      const day = orderDate.getDate();
      if (day >= 1 && day <= daysInMonth) {
        // Add order total to that day's sales
        const orderTotal = order.total || 0;
        dailySales[day] = (dailySales[day] || 0) + (typeof orderTotal === 'number' && !isNaN(orderTotal) ? orderTotal : 0);
      }
    }
  });
  
  // Convert to array format
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      day,
      sales: dailySales[day] || 0,
      date: new Date(year, month - 1, day)
    };
  });
};

export default function ArtistWriterHome() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: { day: number; sales: number; date: Date } } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  // Load user data, orders, and products
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
        
        if (userData) {
          const ordersData = await fetchOrdersByCreator(userData.name);
          setOrders(ordersData);
          
          // Fetch products by creator (author)
          const productsData = await fetchProductsByAuthor(userData.name);
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);
  
  // Calculate order counts
  // confirmed status = to confirm (waiting for artist to confirm)
  // shipped status = to ship (ready to ship, corresponds to processing in collector)
  const toConfirmCount = orders.filter(o => o.status === "confirmed").length;
  const toShipCount = orders.filter(o => o.status === "shipped").length;
  const canceledCount = orders.filter(o => o.status === "cancelled").length;

  // Calculate sales and revenue from actual orders
  const completedOrders = useMemo(() => {
    // ถ้ายังไม่มี orders หรือ orders เป็น empty array ให้ return empty array
    if (!orders || orders.length === 0) return [];
    // Only count orders that are delivered or shipped (completed sales)
    return orders.filter(o => o && (o.status === "delivered" || o.status === "shipped"));
  }, [orders]);

  // Calculate total sales this month
  const totalSalesThisMonth = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    return completedOrders.filter(o => {
      if (!o.dateISO) return false;
      const orderDate = new Date(o.dateISO);
      return orderDate.getFullYear() === currentYear && 
             orderDate.getMonth() + 1 === currentMonth;
    }).length;
  }, [completedOrders]);

  // Calculate total revenue from all completed orders
  const totalRevenue = useMemo(() => {
    if (!completedOrders || completedOrders.length === 0) return 0;
    return completedOrders.reduce((sum, order) => {
      const orderTotal = order.total || 0;
      return sum + (typeof orderTotal === 'number' && !isNaN(orderTotal) ? orderTotal : 0);
    }, 0);
  }, [completedOrders]);

  // Format revenue for display
  const formatRevenue = (amount: number) => {
    // ถ้าไม่มีจำนวนเงินหรือเป็น 0 ให้แสดง "-"
    if (!amount || amount === 0 || isNaN(amount)) return "-";
    if (amount >= 1000000) {
      return `฿${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `฿${(amount / 1000).toFixed(0)}K`;
    }
    return `฿${amount.toLocaleString()}`;
  };

  // Calculate sales data from actual orders
  const salesData = useMemo(() => {
    return calculateSalesData(orders, selectedYear, selectedMonth);
  }, [orders, selectedYear, selectedMonth]);
  
  // Calculate max sales for chart - use at least 1 to avoid division by zero
  const maxSales = useMemo(() => {
    const max = Math.max(...salesData.map(d => d.sales), 0);
    return max > 0 ? max : 1; // Use 1 as minimum to show empty chart properly
  }, [salesData]);

  // Update chart dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const rect = chartContainerRef.current.getBoundingClientRect();
        setChartDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate responsive dimensions
  const chartWidth = chartDimensions.width || 800;
  const chartHeight = chartDimensions.height || 200;
  const paddingLeft = Math.max(50, chartWidth * 0.08);
  const paddingRight = Math.max(20, chartWidth * 0.03);
  const paddingTop = Math.max(20, chartHeight * 0.1);
  // Calculate product counts
  const totalProducts = products.length;
  const liveProducts = products.filter(p => p.status === "approved").length;

  const paddingBottom = Math.max(30, chartHeight * 0.15);
  return (
    <div className="flex flex-col gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Home</h2>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-6">
            <div className="flex items-center gap-4 pl-2">
              <img
                src={user?.avatar || "/img/profile1.jpg"}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold text-lg">{user?.name || "Sophia Mitchell"}</h3>
                <p className="text-sm text-gray-500">
                  {user?.storeName ? `Store: ${user.storeName}` : "Joined 2020"}
                </p>
              </div>
            </div>
            <Link
              href="/artist-writer/setting"
              className="px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              View Store Info
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <Link href="/artist-writer/my-product" className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
              <FaBox className="text-purple-600 text-lg mb-2" />
              <span className="text-2xl font-bold text-purple-600">{liveProducts}</span>
              <p className="text-sm text-gray-700 mt-2">Products</p>
              <p className="text-xs text-gray-400">Active listings</p>
            </Link>
            
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaChartLine className="text-green-600 text-lg mb-2" />
              <span className="text-2xl font-bold text-green-600">
                {totalSalesThisMonth > 0 ? totalSalesThisMonth : "0"}
              </span>
              <p className="text-sm text-gray-700 mt-2">Total Sales</p>
              <p className="text-xs text-gray-400">This month</p>
            </div>
            
            <Link href="/artist-writer/finance" className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <FaMoneyBillWave className="text-blue-600 text-lg mb-2" />
              <span className="text-2xl font-bold text-blue-600">
                {formatRevenue(totalRevenue)}
              </span>
              <p className="text-sm text-gray-700 mt-2">Revenue</p>
              <p className="text-xs text-gray-400">Total earnings</p>
            </Link>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Order Status</h3>
            <a
              href="#"
              className="text-purple-600 text-sm font-medium hover:underline"
            >
              View Sales History &gt;
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaClock className="text-yellow-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-yellow-500">{toConfirmCount}</span>
              <p className="text-sm text-gray-700 mt-2">To Confirm</p>
              <p className="text-xs text-gray-400">Orders in queue</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaTruck className="text-blue-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-blue-500">{toShipCount}</span>
              <p className="text-sm text-gray-700 mt-2">To Ship</p>
              <p className="text-xs text-gray-400">Ready for shipment</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <FaTimesCircle className="text-red-400 text-lg mb-2" />
              <span className="text-2xl font-bold text-red-500">{canceledCount}</span>
              <p className="text-sm text-gray-700 mt-2">Canceled</p>
              <p className="text-xs text-gray-400">Canceled orders</p>
            </div>
          </div>
        </div>

        {/* Sales Dashboard */}
        <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Sales Dashboard</h3>
            <div className="flex gap-2 items-center">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Select month"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Select year"
              >
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          <div 
            ref={chartContainerRef}
            className="relative w-full h-72 bg-white border border-gray-100 rounded-xl p-4"
          >
            <style jsx>{`
              @keyframes popUp {
                0% {
                  opacity: 0;
                  transform: translateX(-50%) translateY(10px) scale(0.9);
                }
                100% {
                  opacity: 1;
                  transform: translateX(-50%) translateY(0) scale(1);
                }
              }
            `}</style>
            {/* Chart SVG */}
            {chartDimensions.width > 0 && (
              <>
                <svg
                  width={chartWidth}
                  height={chartHeight}
                  className="absolute bottom-0 h-full w-full"
                  style={{ left: 0, right: 0 }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
              
              {/* Grid Lines - เส้นประที่ตรงกับ Y-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = chartHeight - paddingBottom - (ratio * (chartHeight - paddingTop - paddingBottom));
                return (
                  <line
                    key={i}
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              })}
              
              {/* Y-axis (Vertical Axis) - เส้นแกน Y ชัดเจน */}
              <line
                x1={paddingLeft}
                y1={paddingTop}
                x2={paddingLeft}
                y2={chartHeight - paddingBottom}
                stroke="#333333"
                strokeWidth="2"
              />
              
              {/* X-axis (Base Axis) - เส้นแกน X ชัดเจน */}
              <line
                x1={paddingLeft}
                y1={chartHeight - paddingBottom}
                x2={chartWidth - paddingRight}
                y2={chartHeight - paddingBottom}
                stroke="#333333"
                strokeWidth="2"
              />
              
              {/* Bar Chart */}
              {salesData.map((d, i) => {
                const chartAreaWidth = chartWidth - paddingLeft - paddingRight;
                const chartAreaHeight = chartHeight - paddingTop - paddingBottom;
                const barWidth = chartAreaWidth / salesData.length * 0.7; // 70% of available space for each bar
                const barSpacing = chartAreaWidth / salesData.length;
                const x = paddingLeft + (i * barSpacing) + (barSpacing - barWidth) / 2;
                const barHeight = (d.sales / maxSales) * chartAreaHeight;
                const y = chartHeight - paddingBottom - barHeight;
                const isHovered = hoveredPoint?.data.day === d.day;
                const isLight = i % 2 === 0; // สลับสีอ่อน-เข้ม
                
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isHovered ? "#c084fc" : (isLight ? "#a855f7" : "#9333ea")}
                    fillOpacity={isHovered ? "1" : (isLight ? "0.3" : "1")}
                    className="cursor-pointer transition-all duration-200"
                    style={isHovered ? { transform: 'scaleY(1.05)', transformOrigin: 'bottom' } : {}}
                    rx="2"
                    onMouseEnter={(e) => {
                      const svgElement = e.currentTarget.closest('svg');
                      const containerElement = chartContainerRef.current;
                      if (svgElement && containerElement) {
                        const svgRect = svgElement.getBoundingClientRect();
                        const containerRect = containerElement.getBoundingClientRect();
                        if (svgRect && chartWidth > 0) {
                          const scaleX = svgRect.width / chartWidth;
                          const barCenterX = x + barWidth / 2;
                          setHoveredPoint({
                            x: containerRect.left + paddingLeft + (barCenterX - paddingLeft) * scaleX,
                            y: containerRect.top + y * (svgRect.height / chartHeight),
                            data: d
                          });
                        }
                      }
                    }}
                  />
                );
              })}
                </svg>

                {/* X-axis Labels (Days) - แสดงทุกวัน อยู่ล่างแกน X */}
                <div className="absolute text-xs text-gray-400" style={{ 
                  left: `${paddingLeft}px`, 
                  right: `${paddingRight}px`,
                  bottom: `2px`
                }}>
                  <div className="flex justify-between">
                    {salesData.map((d) => (
                      <span key={d.day} className="text-center" style={{ width: `${100 / salesData.length}%` }}>
                        {d.day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Y-axis Labels (Sales) - แสดงจำนวนเงินจริง ตรงกับ grid lines */}
                <div className="absolute left-0 text-xs text-gray-400 pl-2" style={{ 
                  top: `${paddingTop}px`,
                  bottom: `${paddingBottom}px`
                }}>
                  <div className="h-full flex flex-col justify-between">
                    {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                      <span key={ratio} className="leading-none">
                        ฿{Math.ceil(maxSales * ratio).toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tooltip - แสดงวันที่และราคาจริงเมื่อ cursor ชี้ไปที่แท่ง */}
            {hoveredPoint && (
              <div
                className="absolute bg-gray-900 text-white rounded-lg px-4 py-3 shadow-2xl z-30 pointer-events-none border-2 border-purple-400"
                style={{
                  left: `${hoveredPoint.x}px`,
                  top: `${hoveredPoint.y - 90}px`,
                  transform: 'translateX(-50%)',
                  minWidth: '150px',
                  animation: 'popUp 0.3s ease-out'
                }}
              >
                <div className="text-xs text-gray-300 mb-1.5">
                  {hoveredPoint.data.date.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-purple-300 font-bold text-lg">
                  ฿{hoveredPoint.data.sales.toLocaleString('en-US', { 
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-400"></div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}