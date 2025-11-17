// lib/users/queries.ts
import { User, Order, AdminLog } from "./types";
import {
  safeGet,
  USERS_KEY,
  SEED_USERS,
  ORDERS,
  ADMIN_LOGS,
} from "./store";
import { getProducts } from "@/lib/products";

/* ---------- Users ---------- */
export function getUsers(): User[] {
  // ถ้า localStorage ว่างจะใช้ SEED_USERS เป็นค่าเริ่มต้น
  return safeGet<User[]>(USERS_KEY, SEED_USERS);
}

export function getUserById(id: string) {
  return getUsers().find((u) => u.id === id) || null;
}

export function getUserByEmail(email: string) {
  const e = email.toLowerCase();
  return (
    getUsers().find((u) => u.email.toLowerCase() === e) || null
  );
}

/* ---------- Creator → artworks (เชื่อมกับ products จริง) ---------- */
export function listArtworksByCreator(userName: string) {
  const name = userName.toLowerCase();
  return getProducts().filter((p) => p.author.toLowerCase() === name);
}

/* ---------- Collector → orders (เชื่อมกับ ORDERS จริง) ---------- */
export function listOrdersByBuyer(userId: string): Order[] {
  return ORDERS.filter((o) => o.buyerId === userId);
}

/* ---------- Admin → logs ---------- */
export function listLogsByAdmin(adminId: string): AdminLog[] {
  return ADMIN_LOGS
    .filter((log) => log.adminId === adminId)
    .sort(
      (a, b) =>
        new Date(b.atISO).getTime() - new Date(a.atISO).getTime()
    );
}

/* ---------- Helper: Collectors ที่มี Order จริง ---------- */
export type CollectorWithOrders = {
  collector: User;
  totalOrders: number;
  totalItems: number;
  totalPaid: number;
};

export function listCollectorsWithOrders(): CollectorWithOrders[] {
  const users = getUsers();
  const collectors = users.filter((u) => u.role === "Collector");

  return collectors
    .map((c) => {
      const orders = ORDERS.filter((o) => o.buyerId === c.id);
      if (orders.length === 0) return null;

      let totalOrders = orders.length;
      let totalItems = 0;
      let totalPaid = 0;

      for (const o of orders) {
        totalPaid += o.total;
        for (const item of o.items) {
          totalItems += item.qty;
        }
      }

      return {
        collector: c,
        totalOrders,
        totalItems,
        totalPaid,
      };
    })
    .filter(Boolean) as CollectorWithOrders[];
}
