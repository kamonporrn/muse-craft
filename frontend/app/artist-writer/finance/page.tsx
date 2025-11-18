"use client";

import { useState, useMemo, useEffect } from "react";
import { FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import { fetchCurrentUser, fetchOrdersByCreator, fetchProductById, type ApiUser, type ApiOrder, type ApiProduct } from "@/lib/api";

type PeriodType = 'daily' | 'monthly' | 'yearly';

// Category colors
const categoryColors: Record<string, string> = {
  "Painting": "#6366F1",
  "Sculpture": "#EC4899",
  "Literature (E-book)": "#10B981",
  "Graphic Design": "#F59E0B",
  "Crafts": "#8B5CF6",
  "Digital Art": "#EF4444",
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function FinancePage() {
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayPeriodType, setDisplayPeriodType] = useState<PeriodType>('monthly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarViewMonth, setCalendarViewMonth] = useState(new Date().getMonth() + 1);
  const [calendarViewYear, setCalendarViewYear] = useState(new Date().getFullYear());
  
  // Load orders and products
  const [user, setUser] = useState<ApiUser | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<Map<string, ApiProduct>>(new Map());
  const [loading, setLoading] = useState(true);

  // Load user and orders
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
        
        if (userData) {
          const ordersData = await fetchOrdersByCreator(userData.name);
          setOrders(ordersData);
          
          // Load products for all order items - fetch all products at once for efficiency
          const { fetchProducts } = await import("@/lib/api");
          const allProducts = await fetchProducts();
          const productMap = new Map<string, ApiProduct>();
          allProducts.forEach(product => {
            productMap.set(product.id, product);
          });
          setProducts(productMap);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Check if selected date is in the future
  const isDateInFuture = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (periodType === 'daily') {
      const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate > today;
    } else if (periodType === 'monthly') {
      // For monthly: check if the selected month is in the future
      // If same year, check if month is after current month
      // If different year, check if year is in the future
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 1-12
      
      if (selectedYear > currentYear) {
        return true; // Year is in the future
      } else if (selectedYear === currentYear && selectedMonth > currentMonth) {
        return true; // Month is in the future (same year)
      }
      return false;
    } else if (periodType === 'yearly') {
      // For yearly: check if the selected year is in the future
      const currentYear = today.getFullYear();
      return selectedYear > currentYear;
    }
    return false;
  }, [periodType, selectedYear, selectedMonth, selectedDay]);

  // Check if a specific day is in the future
  const isDayInFuture = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month - 1, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  // Check if a specific month is in the future
  const isMonthInFuture = (year: number, month: number): boolean => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    
    if (year > currentYear) {
      return true; // Year is in the future
    } else if (year === currentYear && month > currentMonth) {
      return true; // Month is in the future (same year)
    }
    return false;
  };

  // Check if a specific year is in the future
  const isYearInFuture = (year: number): boolean => {
    const today = new Date();
    const todayYear = new Date(today.getFullYear(), 0, 1);
    const checkDate = new Date(year, 0, 1);
    return checkDate > todayYear;
  };

  const handlePeriodChange = (newPeriod: PeriodType) => {
    if (newPeriod !== periodType) {
      setIsAnimating(true);
      setTimeout(() => {
        setPeriodType(newPeriod);
        setDisplayPeriodType(newPeriod);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Reset animation when period type changes
  useEffect(() => {
    if (periodType !== displayPeriodType) {
      setIsAnimating(false);
      setDisplayPeriodType(periodType);
    }
  }, [periodType, displayPeriodType]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDatePicker && !target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDatePicker]);

  // Calculate finance data from actual orders
  const data = useMemo(() => {
    // Only count completed orders (delivered or shipped)
    const completedOrders = orders.filter(o => 
      o && (o.status === "delivered" || o.status === "shipped")
    );

    // Filter orders by selected period
    const filteredOrders = completedOrders.filter(order => {
      if (!order.dateISO) return false;
      const orderDate = new Date(order.dateISO);
      
      if (periodType === 'daily') {
        return orderDate.getFullYear() === selectedYear &&
               orderDate.getMonth() + 1 === selectedMonth &&
               orderDate.getDate() === selectedDay;
      } else if (periodType === 'monthly') {
        return orderDate.getFullYear() === selectedYear &&
               orderDate.getMonth() + 1 === selectedMonth;
      } else if (periodType === 'yearly') {
        return orderDate.getFullYear() === selectedYear;
      }
      return false;
    });

    // Calculate revenue by category
    const categoryRevenue: Record<string, number> = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.get(item.productId);
        if (product && product.category) {
          const category = product.category;
          const itemRevenue = (item.price || 0) * (item.qty || 1);
          categoryRevenue[category] = (categoryRevenue[category] || 0) + itemRevenue;
        }
      });
    });

    // Convert to array format with all categories
    const allCategories = ["Painting", "Sculpture", "Literature (E-book)", "Graphic Design", "Crafts", "Digital Art"];
    return allCategories.map(category => ({
      name: category,
      value: categoryRevenue[category] || 0,
      color: categoryColors[category] || "#6366F1",
    }));
  }, [orders, products, periodType, selectedYear, selectedMonth, selectedDay]);

  const totalRevenue = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  const total = totalRevenue;

  return (
    <div className="flex flex-col gap-6">
      {/* Combined Finance Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Period Type Selection and Date Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Finance Report</h2>
          
          {/* Tab Bar - Segmented Control */}
          <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handlePeriodChange('daily')}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                periodType === 'daily'
                  ? 'bg-white text-purple-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                periodType === 'monthly'
                  ? 'bg-white text-purple-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handlePeriodChange('yearly')}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                periodType === 'yearly'
                  ? 'bg-white text-purple-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Date Display with Icon */}
          <div className="mb-4">
            <div className="date-picker-container flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 relative">
              <div className="flex-1 text-center">
                <span className="text-gray-800 font-medium">
                  {periodType === 'daily' && `${selectedDay} ${monthNames[selectedMonth - 1]} ${selectedYear}`}
                  {periodType === 'monthly' && `${monthNames[selectedMonth - 1]} ${selectedYear}`}
                  {periodType === 'yearly' && `${selectedYear}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Open date picker"
                >
                  <FaCalendarAlt className="text-gray-400 text-lg cursor-pointer" />
                </button>
              </div>
              
              {/* Date Picker Modal - Calendar */}
              {showDatePicker && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-[320px]">
                  {periodType === 'daily' && (
                    <div className="flex flex-col gap-3">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => {
                            if (calendarViewMonth === 1) {
                              setCalendarViewMonth(12);
                              setCalendarViewYear(calendarViewYear - 1);
                            } else {
                              setCalendarViewMonth(calendarViewMonth - 1);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Previous month"
                        >
                          <span className="text-gray-600">‹</span>
                        </button>
                        <div className="flex gap-2 items-center">
                          <select
                            value={calendarViewMonth}
                            onChange={(e) => setCalendarViewMonth(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            aria-label="Select month"
                          >
                            {monthNames.map((month, i) => (
                              <option key={i + 1} value={i + 1}>{month}</option>
                            ))}
                          </select>
                          <select
                            value={calendarViewYear}
                            onChange={(e) => setCalendarViewYear(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            aria-label="Select year"
                          >
                            {[...Array(5)].map((_, i) => {
                              const year = new Date().getFullYear() - 2 + i;
                              return <option key={year} value={year}>{year}</option>;
                            })}
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            if (calendarViewMonth === 12) {
                              setCalendarViewMonth(1);
                              setCalendarViewYear(calendarViewYear + 1);
                            } else {
                              setCalendarViewMonth(calendarViewMonth + 1);
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          aria-label="Next month"
                        >
                          <span className="text-gray-600">›</span>
                        </button>
                      </div>
                      
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                            {day}
                          </div>
                        ))}
                        
                        {/* Calendar days */}
                        {(() => {
                          const firstDay = new Date(calendarViewYear, calendarViewMonth - 1, 1).getDay();
                          const daysInMonth = new Date(calendarViewYear, calendarViewMonth, 0).getDate();
                          const days = [];
                          
                          // Empty cells for days before month starts
                          for (let i = 0; i < firstDay; i++) {
                            days.push(<div key={`empty-${i}`} className="h-8"></div>);
                          }
                          
                          // Days of the month
                          for (let day = 1; day <= daysInMonth; day++) {
                            const isSelected = day === selectedDay && calendarViewMonth === selectedMonth && calendarViewYear === selectedYear;
                            const isToday = day === new Date().getDate() && calendarViewMonth === new Date().getMonth() + 1 && calendarViewYear === new Date().getFullYear();
                            const isFuture = isDayInFuture(calendarViewYear, calendarViewMonth, day);
                            
                            days.push(
                              <button
                                key={day}
                                onClick={() => {
                                  if (!isFuture) {
                                    setSelectedDay(day);
                                    setSelectedMonth(calendarViewMonth);
                                    setSelectedYear(calendarViewYear);
                                    setShowDatePicker(false);
                                  }
                                }}
                                disabled={isFuture}
                                className={`h-8 w-8 rounded-md text-sm transition-colors ${
                                  isFuture
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                    : isSelected
                                    ? 'bg-purple-600 text-white font-semibold'
                                    : isToday
                                    ? 'bg-purple-100 text-purple-700 font-semibold'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          }
                          
                          return days;
                        })()}
                      </div>
                    </div>
                  )}
                  
                  {periodType === 'monthly' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Month</label>
                        <select
                          value={selectedMonth}
                          onChange={(e) => {
                            const newMonth = Number(e.target.value);
                            const newYear = selectedYear;
                            if (!isMonthInFuture(newYear, newMonth)) {
                              setSelectedMonth(newMonth);
                              setShowDatePicker(false);
                            } else {
                              // If trying to select future month, reset to current month
                              const today = new Date();
                              setSelectedMonth(today.getMonth() + 1);
                              setSelectedYear(today.getFullYear());
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          aria-label="Select month"
                        >
                          {monthNames.map((month, i) => {
                            const monthNum = i + 1;
                            const isFuture = isMonthInFuture(selectedYear, monthNum);
                            return (
                              <option 
                                key={monthNum} 
                                value={monthNum}
                                disabled={isFuture}
                              >
                                {month} {isFuture ? '(Future)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Year</label>
                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            const newYear = Number(e.target.value);
                            if (!isYearInFuture(newYear)) {
                              setSelectedYear(newYear);
                              setShowDatePicker(false);
                            } else {
                              // If trying to select future year, reset to current year
                              const today = new Date();
                              setSelectedYear(today.getFullYear());
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          aria-label="Select year"
                        >
                          {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            const isFuture = isYearInFuture(year);
                            return (
                              <option 
                                key={year} 
                                value={year}
                                disabled={isFuture}
                              >
                                {year} {isFuture ? '(Future)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {periodType === 'yearly' && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Year</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => {
                          const newYear = Number(e.target.value);
                          if (!isYearInFuture(newYear)) {
                            setSelectedYear(newYear);
                            setShowDatePicker(false);
                          } else {
                            // If trying to select future year, reset to current year
                            const today = new Date();
                            setSelectedYear(today.getFullYear());
                          }
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Select year"
                      >
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() - 2 + i;
                          const isFuture = isYearInFuture(year);
                          return (
                            <option 
                              key={year} 
                              value={year}
                              disabled={isFuture}
                            >
                              {year} {isFuture ? '(อนาคต)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Chart Section */}
        <div className="mb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center text-gray-500">Loading finance data...</div>
            </div>
          ) : isDateInFuture ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center">
                <div className="mb-4">
                  <FaCalendarAlt className="text-gray-400 text-5xl mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Future Date
                </h3>
                <p className="text-sm text-gray-600">
                  You cannot view finance reports for future dates
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Please select a past date
                </p>
              </div>
            </div>
          ) : totalRevenue === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center">
                <div className="mb-4">
                  <FaFileAlt className="text-gray-400 text-5xl mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Revenue
                </h3>
                <p className="text-sm text-gray-600">
                  No sales in the selected period
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Revenue will appear when collectors purchase and pay for products
                </p>
              </div>
            </div>
          ) : (
            <>
          <style jsx>{`
            @keyframes chartPop {
              0% {
                opacity: 0;
                transform: scale(0.8);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes slideOut {
              0% {
                opacity: 1;
                transform: translateX(0);
              }
              100% {
                opacity: 0;
                transform: translateX(100px);
              }
            }
            @keyframes slideIn {
              0% {
                opacity: 0;
                transform: translateX(-100px);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .chart-animate {
              animation: chartPop 0.5s ease-out;
            }
            .slide-out {
              animation: slideOut 0.3s ease-out;
            }
            .slide-in {
              animation: slideIn 0.3s ease-out;
            }
          `}</style>
          <div className="flex items-center justify-center relative overflow-hidden">
          <div className={`relative ${isAnimating ? 'slide-out' : periodType === displayPeriodType ? 'slide-in' : ''}`}>
            <svg 
              key={`${displayPeriodType}-${selectedYear}-${selectedMonth}-${selectedDay}`}
              width="400" 
              height="400" 
              viewBox="0 0 42 42" 
              className="donut chart-animate"
            >
              {(() => {
                let cumulative = 0;
                return data.map((item, index) => {
                  const radius = 15.9155;
                  const valuePercent = (item.value / total) * 100;
                  const offset = 100 - cumulative;
                  cumulative += valuePercent;
                  return (
                    <circle
                      key={`${displayPeriodType}-${selectedYear}-${selectedMonth}-${selectedDay}-${index}`}
                      r={radius}
                      cx="21"
                      cy="21"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={7}
                      strokeDasharray={`${valuePercent} ${100 - valuePercent}`}
                      strokeDashoffset={offset}
                      style={{
                        transition: 'stroke-dasharray 0.5s ease-out, stroke-dashoffset 0.5s ease-out'
                      }}
                    />
                  );
                });
              })()}
                    {/* Center text showing total revenue */}
                    <text
                      x="21"
                      y="15"
                      textAnchor="middle"
                      className="fill-gray-800"
                      style={{
                        fontSize: '1.5px',
                        fontWeight: 'normal',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      Total Revenue
                    </text>
                    <text
                      x="21"
                      y="23"
                      textAnchor="middle"
                      className="fill-gray-800"
                      style={{
                        fontSize: '6.5px',
                        fontWeight: 'bold',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      {totalRevenue > 0 ? totalRevenue.toLocaleString() : '0'}
                    </text>
                    <text
                      x="21"
                      y="27"
                      textAnchor="middle"
                      className="fill-gray-600"
                      style={{
                        fontSize: '1.5px',
                        fontFamily: 'Arial, sans-serif'
                      }}
                    >
                      Baht
                    </text>
            </svg>
          </div>
          </div>
          <div className={`mt-6 ${isAnimating ? 'slide-out' : periodType === displayPeriodType ? 'slide-in' : ''}`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Income proportion</h3>
            <div className="space-y-3">
            {data.map((item, i) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={`${displayPeriodType}-${item.name}-${i}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                      aria-label={`${item.name} color indicator`}
                    ></span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-base">{item.name}</span>
                      <span className="text-xs text-gray-500">{percentage}% of total</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800 text-lg">{item.value.toLocaleString()}</span>
                    <span className="text-sm text-gray-600 ml-1">Baht</span>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}