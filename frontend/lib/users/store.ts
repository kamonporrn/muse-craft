// lib/users/store.ts
import { User, Credential, Order, AdminLog } from "./types";

/* ------------------ LOCALSTORAGE KEYS ------------------ */
const USERS_KEY = "musecraft.users";
const CREDS_KEY = "musecraft.creds";
const ORDERS_KEY = "musecraft.orders";
const LOGS_KEY  = "musecraft.adminLogs";

/* ------------------ HELPERS: safeGet/safeSet ------------------ */
export function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ------------------ SEED: USERS & CREDS (ของเดิม) ------------------ */
export const SEED_USERS: User[] = [
  {
    id: "u1",
    accountId: "#CRE-001",
    name: "Olivia Chen",
    email: "creator@email.com",
    role: "Creator",
    status: "Normal",
    avatar: "/img/avatars/a1.jpg",
  },
  {
    id: "u2",
    accountId: "#COL-001",
    name: "Noah Brown",
    email: "collector@email.com",
    role: "Collector",
    status: "Normal",
    avatar: "/img/avatars/a3.jpg",
  },
  {
    id: "u4",
    accountId: "#AD-001",
    name: "Admin01",
    email: "admin01@test.com",
    role: "Admin",
    status: "Normal",
    avatar: "/img/avatars/a4.jpg",
  },
];

export const SEED_CREDS: Credential[] = [
  { email: "admin01@test.com",    password: "Admin01",    userId: "u4" },
  { email: "creator@email.com",   password: "creator123", userId: "u1" },
  { email: "collector@email.com", password: "collector123", userId: "u2" },
];

/* ------------------ SEED: ORDERS + LOGS (ใหม่) ------------------ */
/** 
 * ใช้ชื่อสินค้ากับราคาให้ตรงกับ lib/products.ts:
 *  - Ocean Whisper        → 1499
 *  - Neon Poster Set      → 499
 *  - Siam Weave           → 1699
 */
export const SEED_ORDERS: Order[] = [
  {
    id: "o-10001",
    buyerId: "u2", // Noah Brown (Collector)
    items: [
      { name: "Ocean Whisper",   price: 1499, qty: 1 },
      { name: "Neon Poster Set", price: 499,  qty: 2 },
    ],
    total: 1499 + 499 * 2,
    dateISO: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: "o-10002",
    buyerId: "u2", // Noah Brown ซื้ออีก order
    items: [
      { name: "Siam Weave", price: 1699, qty: 1 },
    ],
    total: 1699,
    dateISO: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
];

export const SEED_ADMIN_LOGS: AdminLog[] = [
  {
    id: "L-1",
    adminId: "u4",
    atISO: new Date(Date.now() - 3600e3).toISOString(),
    action: "Approved artwork",
    target: "Ocean Whisper",
  },
  {
    id: "L-2",
    adminId: "u4",
    atISO: new Date(Date.now() - 2 * 3600e3).toISOString(),
    action: "Suspended user",
    target: "Some user",
  },
  {
    id: "L-3",
    adminId: "u4",
    atISO: new Date(Date.now() - 28 * 3600e3).toISOString(),
    action: "Created auction",
    target: "Siam Weave",
  },
];

/* ------------------ INITIALIZE SEED (ครั้งแรก) ------------------ */
export function ensureSeed() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(USERS_KEY)) {
    safeSet(USERS_KEY, SEED_USERS);
  }
  if (!localStorage.getItem(CREDS_KEY)) {
    safeSet(CREDS_KEY, SEED_CREDS);
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    safeSet(ORDERS_KEY, SEED_ORDERS);
  }
  if (!localStorage.getItem(LOGS_KEY)) {
    safeSet(LOGS_KEY, SEED_ADMIN_LOGS);
  }
}

ensureSeed();

/* ------------------ RUNTIME VIEWS (อ่านจาก localStorage) ------------------ */
/** 
 * ถ้าอยากอ่าน Order/Logs ที่อัปเดตล่าสุด (หลัง CRUD) 
 * ให้ import ORDERS / ADMIN_LOGS พวกนี้ไปใช้
 */
export const ORDERS: Order[] = safeGet<Order[]>(ORDERS_KEY, SEED_ORDERS);
export const ADMIN_LOGS: AdminLog[] = safeGet<AdminLog[]>(LOGS_KEY, SEED_ADMIN_LOGS);

/* ------------------ EXPORT KEYS ------------------ */
export { USERS_KEY, CREDS_KEY, ORDERS_KEY, LOGS_KEY };
