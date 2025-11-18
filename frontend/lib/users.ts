// lib/users.ts
import { products } from "@/lib/products";

/* =========================
 * Types
 * =========================*/
export type Role = "Creator" | "Collector" | "Admin";
export type Status = "Normal" | "Suspended" | "Deleted";

export type User = {
  id: string;
  accountId: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  avatar?: string;
};

export type Order = {
  id: string;
  buyerId: string; // user.id
  items: Array<{ name: string; price: number; qty: number }>;
  total: number;
  dateISO: string;
};

export type AdminLog = {
  id: string;
  adminId: string;
  atISO: string;
  action: string;
  target?: string;
};

export type Credential = { email: string; password: string; userId: string };

/* =========================
 * Seed data (ใช้ครั้งแรก)
 * =========================*/
const SEED_USERS: User[] = [
  { id: "u1", accountId: "#CRE-001", name: "Olivia Chen",  email: "creator@email.com",   role: "Creator",   status: "Normal",    avatar: "/img/avatars/a1.jpg" },
  { id: "u2", accountId: "#CRE-002", name: "Mason Park",   email: "creator2@email.com",  role: "Creator",   status: "Suspended", avatar: "/img/avatars/a2.jpg" },
  { id: "u3", accountId: "#COL-001", name: "Noah Brown",   email: "collector@email.com", role: "Collector", status: "Normal",    avatar: "/img/avatars/a3.jpg" },
  { id: "u4", accountId: "#AD-001",  name: "Admin01",      email: "admin01@email.com",   role: "Admin",     status: "Normal",    avatar: "/img/avatars/a4.jpg" },
];

const SEED_CREDS: Credential[] = [
  { email: "Admin01@test.com",  password: "Admin01",     userId: "u4" }, // Admin demo
  { email: "creator@email.com", password: "creator123",  userId: "u1" },
  { email: "creator2@email.com",password: "creator123",  userId: "u2" },
  { email: "collector@email.com", password: "collector123", userId: "u3" },
];

export const ORDERS: Order[] = [
  {
    id: "o-10001",
    buyerId: "u3", // Noah Brown
    items: [
      { name: "Ocean Whisper", price: 1499, qty: 1 },
      { name: "Neon Poster Set", price: 499, qty: 2 },
    ],
    total: 1499 + 499 * 2,
    dateISO: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
];

export const ADMIN_LOGS: AdminLog[] = [
  { id: "L-1", adminId: "u4", atISO: new Date(Date.now() - 3600e3).toISOString(),    action: "Approved artwork", target: "Ocean Whisper" },
  { id: "L-2", adminId: "u4", atISO: new Date(Date.now() - 2 * 3600e3).toISOString(),action: "Suspended user",   target: "Mason Park" },
];

/* =========================
 * Local storage store
 * =========================*/
const USERS_KEY = "musecraft.users";
const CREDS_KEY = "musecraft.creds";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// init once (client)
function ensureSeed() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(USERS_KEY)) safeSet(USERS_KEY, SEED_USERS);
  if (!localStorage.getItem(CREDS_KEY)) safeSet(CREDS_KEY, SEED_CREDS);
}
ensureSeed();

/* =========================
 * Public getters/setters
 * =========================*/
export function getUsers(): User[] {
  return safeGet<User[]>(USERS_KEY, SEED_USERS);
}
export function setUsers(list: User[]) {
  safeSet<User[]>(USERS_KEY, list);
}
export function getCreds(): Credential[] {
  return safeGet<Credential[]>(CREDS_KEY, SEED_CREDS);
}
export function setCreds(list: Credential[]) {
  safeSet<Credential[]>(CREDS_KEY, list);
}

/* =========================
 * Queries
 * =========================*/
export function getUserById(id: string) {
  return getUsers().find((u) => u.id === id) || null;
}
export function getUserByEmail(email: string) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/* Creator → artworks */
export function listArtworksByCreator(userName: string) {
  return products.filter((p) => p.author === userName);
}
/* Collector → orders */
export function listOrdersByBuyer(userId: string) {
  return ORDERS.filter((o) => o.buyerId === userId);
}
/* Admin → logs */
export function listLogsByAdmin(adminId: string) {
  return ADMIN_LOGS
    .filter((l) => l.adminId === adminId)
    .sort((a, b) => new Date(b.atISO).getTime() - new Date(a.atISO).getTime());
}

/* =========================
 * Mutations (Users)
 * =========================*/
export function upsertUser(user: User) {
  const list = getUsers();
  const idx = list.findIndex((u) => u.id === user.id);
  if (idx >= 0) list[idx] = user;
  else list.push(user);
  setUsers(list);
  return user;
}
export function setUserStatus(id: string, status: Status) {
  const list = getUsers().map((u) => (u.id === id ? { ...u, status } : u));
  setUsers(list);
}
export function suspendUser(id: string) {
  setUserStatus(id, "Suspended");
}
export function restoreUser(id: string) {
  setUserStatus(id, "Normal");
}
export function deleteUserSoft(id: string) {
  setUserStatus(id, "Deleted");
}
export function removeUserHard(id: string) {
  setUsers(getUsers().filter((u) => u.id !== id));
  setCreds(getCreds().filter((c) => c.userId !== id));
}

/* =========================
 * Credentials helpers
 * =========================*/
export function addCredential(c: Credential) {
  const list = getCreds();
  list.push(c);
  setCreds(list);
}
export function removeCredentialByUser(userId: string) {
  setCreds(getCreds().filter((c) => c.userId !== userId));
}

/* =========================
 * Auth helpers
 * =========================*/
export function validateUser(email: string, password: string) {
  const cred = getCreds().find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  if (!cred) return null;

  const u = getUserById(cred.userId);
  if (!u) return null;

  if (u.status === "Suspended") return { ...u, _error: "suspended" } as any;
  if (u.status === "Deleted") return { ...u, _error: "deleted" } as any;

  return u;
}

/* เก็บ session แบบง่าย (ฝั่ง client) */
export function setSessionFromUser(u: User) {
  // เก็บ role ตัวเล็กไว้ใช้กับ guards
  const roleLower = String(u.role).toLowerCase();
  if (typeof window === "undefined") return;
  localStorage.setItem("musecraft.signedIn", "true");
  localStorage.setItem("musecraft.userName", u.name);
  localStorage.setItem("musecraft.role", roleLower);   // ใช้ตัวเล็ก
  localStorage.setItem("musecraft.roleRaw", u.role);   // เก็บค่าเดิมเพื่อแสดงผล
}
export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("musecraft.signedIn");
  localStorage.removeItem("musecraft.userName");
  localStorage.removeItem("musecraft.role");
  localStorage.removeItem("musecraft.roleRaw");
}
