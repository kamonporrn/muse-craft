"use client";

import { useState, useMemo, useEffect } from "react";
import { FaCalendarAlt, FaFileAlt } from "react-icons/fa";

type PeriodType = 'daily' | 'monthly' | 'yearly';

// Generate finance data based on period type
const generateFinanceData = (periodType: PeriodType, year: number, month: number, day?: number) => {
  let baseValue = 3000;
  
  if (periodType === 'daily' && day) {
    baseValue = 2000 + Math.sin((day / 31) * Math.PI * 2) * 1500;
  } else if (periodType === 'monthly') {
    baseValue = 3000 + Math.sin((month / 12) * Math.PI * 2) * 2000;
  } else if (periodType === 'yearly') {
    baseValue = 40000 + Math.sin((year % 10) * 0.5) * 15000;
  }
  
  const variation = (Math.random() - 0.5) * 1000;
  
  return [
    { name: "Painting", value: Math.max(1000, Math.round(baseValue + variation)), color: "#6366F1" },
    { name: "Sculpture", value: Math.max(800, Math.round(baseValue * 0.8 + variation * 0.7)), color: "#EC4899" },
    { name: "Literature (E-book)", value: Math.max(600, Math.round(baseValue * 0.6 + variation * 0.5)), color: "#10B981" },
    { name: "Graphic Design", value: Math.max(500, Math.round(baseValue * 0.5 + variation * 0.4)), color: "#F59E0B" },
    { name: "Crafts", value: Math.max(400, Math.round(baseValue * 0.4 + variation * 0.3)), color: "#8B5CF6" },
    { name: "Digital Art", value: Math.max(300, Math.round(baseValue * 0.3 + variation * 0.2)), color: "#EF4444" },
  ];
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

  const data = useMemo(() => {
    if (periodType === 'daily') {
      return generateFinanceData('daily', selectedYear, selectedMonth, selectedDay);
    } else if (periodType === 'monthly') {
      return generateFinanceData('monthly', selectedYear, selectedMonth);
    } else {
      return generateFinanceData('yearly', selectedYear, selectedMonth);
    }
  }, [periodType, selectedYear, selectedMonth, selectedDay]);

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
                            
                            days.push(
                              <button
                                key={day}
                                onClick={() => {
                                  setSelectedDay(day);
                                  setSelectedMonth(calendarViewMonth);
                                  setSelectedYear(calendarViewYear);
                                  setShowDatePicker(false);
                                }}
                                className={`h-8 w-8 rounded-md text-sm transition-colors ${
                                  isSelected
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
                            setSelectedMonth(Number(e.target.value));
                            setShowDatePicker(false);
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          aria-label="Select month"
                        >
                          {monthNames.map((month, i) => (
                            <option key={i + 1} value={i + 1}>{month}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Year</label>
                        <select
                          value={selectedYear}
                          onChange={(e) => {
                            setSelectedYear(Number(e.target.value));
                            setShowDatePicker(false);
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          aria-label="Select year"
                        >
                          {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return <option key={year} value={year}>{year}</option>;
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
                          setSelectedYear(Number(e.target.value));
                          setShowDatePicker(false);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Select year"
                      >
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() - 2 + i;
                          return <option key={year} value={year}>{year}</option>;
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
                      {totalRevenue.toLocaleString()}
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
        </div>
      </div>
    </div>
  );
}