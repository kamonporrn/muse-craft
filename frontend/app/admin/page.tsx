"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { getUsers } from "@/lib/users";
import { getProducts } from "@/lib/products";
import { ensureCreatorUsersFromProducts } from "@/lib/users/seedCreatorsFromProducts";

/** สีหลัก */
const pink   = "#ec4899";   // Artworks
const green  = "#10b981";   // Creators
const orange = "#f59e0b";   // Collectors

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** ช่วยคำนวณ path เส้นโค้งสวย ๆ */
function buildSmoothPath(
  values: number[],
  W: number,
  H: number,
  pad: number,
  min: number,
  max: number
) {
  const x = (i: number, n: number) => pad + (i * (W - pad * 2)) / (n - 1);
  const y = (v: number) =>
    H - pad - ((v - min) * (H - pad * 2)) / Math.max(1, max - min);

  const n = values.length;
  let d = `M ${x(0, n)} ${y(values[0])}`;
  for (let i = 1; i < n; i++) {
    const xc = (x(i - 1, n) + x(i, n)) / 2;
    const yc = (y(values[i - 1]) + y(values[i])) / 2;
    d += ` Q ${x(i - 1, n)} ${y(values[i - 1])}, ${xc} ${yc}`;
  }
  d += ` T ${x(n - 1, n)} ${y(values[n - 1])}`;

  const points = values.map((v, i) => ({ cx: x(i, n), cy: y(v), val: v }));
  return { d, points };
}

/** สร้าง weekly series จาก total จริง
 * ให้วันแรกต่ำกว่า และค่อย ๆ ไต่ขึ้นไปจนถึง total ปัจจุบัน
 */
function buildWeeklyFromTotal(total: number, days = 7): number[] {
  if (total <= 0) return new Array(days).fill(0);
  if (days <= 1) return [total];

  const step = Math.max(1, Math.floor(total / days));
  const base = Math.max(0, total - step * (days - 1));

  const arr: number[] = [];
  for (let i = 0; i < days; i++) {
    const v = base + step * i;
    arr.push(Math.min(v, total));
  }
  // ให้ค่า last day = total เป๊ะ ๆ
  arr[days - 1] = total;
  return arr;
}

export default function AdminDashboard() {
  // ===== Guard: ต้องเป็น admin เท่านั้น =====
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

  // ===== ดึงข้อมูลจริงจาก lib =====
  const [totals, setTotals] = useState({
    artworks: 0,
    creators: 0,
    collectors: 0,
  });

  useEffect(() => {
    if (!ok) return;

    (async () => {
      // 1) ensure Creator จาก products ถูกสร้างเป็น user role "Creator" แล้ว
      ensureCreatorUsersFromProducts();

      // 2) users จาก localStorage ผ่าน lib/users
      const allUsers = getUsers();
      const creators = allUsers.filter((u) => u.role === "Creator").length;
      const collectors = allUsers.filter((u) => u.role === "Collector").length;

      // 3) artworks จาก lib/products ผ่าน getProducts()
      const allProducts = await getProducts();
      const artworks = allProducts.length;

      setTotals({ artworks, creators, collectors });
    })();
  }, [ok]);

  // weekly series ผูกกับ total จริง (ปลายสัปดาห์ = ค่าปัจจุบัน)
  const weekly = useMemo(
    () => ({
      artworks: buildWeeklyFromTotal(totals.artworks),
      creators: buildWeeklyFromTotal(totals.creators),
      collectors: buildWeeklyFromTotal(totals.collectors),
    }),
    [totals]
  );

  // ค่าปัจจุบัน = วันสุดท้ายของสัปดาห์ | Δ = last - first
  const nowStats = [
    { key: "artworks",   label: "Total Artworks",   color: pink,   value: weekly.artworks.at(-1)!,   delta: weekly.artworks.at(-1)!   - weekly.artworks[0] },
    { key: "creators",   label: "Total Creators",   color: green,  value: weekly.creators.at(-1)!,   delta: weekly.creators.at(-1)!   - weekly.creators[0] },
    { key: "collectors", label: "Total Collectors", color: orange, value: weekly.collectors.at(-1)!, delta: weekly.collectors.at(-1)! - weekly.collectors[0] },
  ];

  /** เตรียมซีรีส์กราฟ */
  const series = [
    { name: "Artworks",   color: pink,   data: weekly.artworks },
    { name: "Creators",   color: green,  data: weekly.creators },
    { name: "Collectors", color: orange, data: weekly.collectors },
  ];

  // หา min/max เพื่อสเกลกราฟพอดี
  const { minVal, maxVal } = useMemo(() => {
    const all = series.flatMap((s) => s.data);
    if (all.length === 0) return { minVal: 0, maxVal: 1 };
    return { minVal: Math.min(...all), maxVal: Math.max(...all) || 1 };
  }, [series]);

  // คำนวณ path/จุดสำหรับ SVG
  const chart = useMemo(() => {
    const W = 900;
    const H = 280;
    const pad = 28;
    return series.map((s) => ({
      name: s.name,
      color: s.color,
      ...buildSmoothPath(s.data, W, H, pad, minVal, maxVal),
    }));
  }, [series, minVal, maxVal]);

  /** Hover tooltip */
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pad = 28;
    const W = 900;
    const inner = W - pad * 2;
    const step = inner / (DAYS.length - 1);
    const idx = Math.round((x - pad) / step);
    if (idx >= 0 && idx < DAYS.length) setHoverIdx(idx);
  };
  const handleLeave = () => setHoverIdx(null);

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

        {/* STAT CARDS + Δ สัปดาห์นี้ จากข้อมูลจริง */}
        <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {nowStats.map((s) => (
            <div
              key={s.key}
              className="rounded-xl bg-white p-4 shadow-[0_6px_0_rgba(0,0,0,0.04)] ring-1 ring-purple-100"
            >
              <div className="text-sm font-semibold text-gray-700">
                {s.label}
              </div>
              <div
                className="mt-1 text-3xl font-extrabold"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div
                className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  color: s.delta >= 0 ? "#065f46" : "#991b1b",
                  background: s.delta >= 0 ? "#d1fae5" : "#fee2e2",
                  border: `1px solid ${
                    s.delta >= 0 ? "#10b98133" : "#ef444433"
                  }`,
                }}
              >
                {s.delta >= 0 ? "▲" : "▼"} {Math.abs(s.delta)} this week
              </div>
            </div>
          ))}
        </section>

        {/* CHART: รายสัปดาห์ (ผูกกับ totals จริง) */}
        <section className="mt-6 rounded-xl bg-white p-4 shadow-[0_6px_0_rgba(0,0,0,0.04)] ring-1 ring-purple-100">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">
              Weekly Trend (by metric)
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {series.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-2">
                  <i
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="text-gray-600">{s.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-white ring-1 ring-gray-100">
            {/* Tooltip (ด้านบนกราฟ) */}
            {hoverIdx !== null && (
              <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow">
                <div className="mb-1 text-center font-semibold text-gray-700">
                  {DAYS[hoverIdx]}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {series.map((s) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <i
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      <span className="text-gray-700">{s.name}:</span>
                      <span className="font-medium text-gray-900">
                        {s.data[hoverIdx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <svg
              viewBox="0 0 900 280"
              className="h-[320px] w-full"
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
            >
              {/* grid lines */}
              {[1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="40"
                  x2="880"
                  y1={40 + i * 40}
                  y2={40 + i * 40}
                  stroke="#eee"
                />
              ))}

              {/* vertical hover guide */}
              {hoverIdx !== null &&
                (() => {
                  const pad = 28;
                  const inner = 900 - pad * 2;
                  const step = inner / (DAYS.length - 1);
                  const x = pad + hoverIdx * step;
                  return (
                    <line
                      x1={x}
                      x2={x}
                      y1={28}
                      y2={252}
                      stroke="#e5e7eb"
                      strokeDasharray="4 4"
                    />
                  );
                })()}

              {/* series lines + points */}
              {chart.map((s, idx) => (
                <g key={idx}>
                  <path
                    d={s.d}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="3"
                  />
                  {s.points.map(
                    (
                      p: { cx: number; cy: number; val: number },
                      i: number
                    ) => (
                      <circle
                        key={i}
                        cx={p.cx}
                        cy={p.cy}
                        r={hoverIdx === i ? 5 : 3.5}
                        fill={s.color}
                        opacity={
                          hoverIdx === null || hoverIdx === i ? 1 : 0.35
                        }
                      />
                    )
                  )}
                </g>
              ))}

              {/* x labels */}
              {DAYS.map((d, i) => (
                <text
                  key={d}
                  x={28 + (i * (900 - 56)) / (DAYS.length - 1)}
                  y={270}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#9ca3af"
                >
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </section>
      </main>
    </div>
  );
}
