// ตัวอย่าง mock data ด้านบน component
const data = [
    { name: "Product A", value: 5000, color: "#6366F1" },
    { name: "Product B", value: 3000, color: "#EC4899" },
    { name: "Product C", value: 2000, color: "#10B981" },
  ];
  
  // รวมยอดทั้งหมด
  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);
  const total = totalRevenue;
  
  export default function FinancePage() {
    return (
      <div className="p-6 flex flex-col gap-4 w-full">
        {/* Total Revenue Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 w-full">
          <h2 className="text-lg font-semibold mb-2 text-black">Total revenue for January</h2>
          <p className="text-4xl font-bold text-black">{totalRevenue.toLocaleString()} Baht</p>
        </div>
  
        {/* Chart Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 w-full">
          <h2 className="text-lg font-semibold mb-4 text-black">Income proportion</h2>
          <div className="flex items-center justify-center">
            <svg width="300" height="300" viewBox="0 0 42 42" className="donut">
              {(() => {
                let cumulative = 0;
                return data.map((item, index) => {
                  const radius = 15.9155;
                  const valuePercent = (item.value / total) * 100;
                  const offset = 100 - cumulative;
                  cumulative += valuePercent;
                  return (
                    <circle
                      key={index}
                      r={radius}
                      cx="21"
                      cy="21"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth={6}
                      strokeDasharray={`${valuePercent} ${100 - valuePercent}`}
                      strokeDashoffset={offset}
                    />
                  );
                });
              })()}
            </svg>
          </div>
          <div className="mt-4 space-y-2 text-sm text-black">
            {data.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>
                  <strong>{item.name}</strong>: {item.value.toLocaleString()} Baht ({((item.value / total) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }