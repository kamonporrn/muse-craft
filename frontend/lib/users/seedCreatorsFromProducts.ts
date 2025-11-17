// lib/users/seedCreatorsFromProducts.ts
import type { User } from "./types";
import { safeGet, safeSet, USERS_KEY } from "./store";
import { getProducts } from "@/lib/products";

function toEmailFromName(name: string) {
  // แปลงชื่อเป็นอีเมลง่าย ๆ สำหรับเดโม่
  const local = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
  return `${local || "creator" }@creator.musecraft.test`;
}

/** 
 * ดึง Creator จาก products (author)
 * แล้วเติมเข้าไปใน musecraft.users ถ้ายังไม่มี user ชื่อนั้น
 */
export function ensureCreatorUsersFromProducts() {
  if (typeof window === "undefined") return;

  // users ปัจจุบัน
  const current = safeGet<User[]>(USERS_KEY, []);
  const byName = new Map(current.map((u) => [u.name.toLowerCase(), u]));

  // นับ creator เดิม เพื่อใช้รันเลข accountId ต่อ
  const existingCreators = current.filter((u) => u.role === "Creator");
  let nextIndex = existingCreators.length + 1;

  const prods = getProducts();
  const nextUsers = [...current];

  for (const p of prods) {
    const key = p.author.toLowerCase();
    if (byName.has(key)) continue; // มี user ชื่อนี้แล้ว ข้าม

    const idNumber = String(nextIndex).padStart(3, "0");
    const newUser: User = {
      id: `cre-${idNumber}`,
      accountId: `#CRE-${idNumber}`,
      name: p.author,                           // 👈 author = Creator name
      email: toEmailFromName(p.author),
      role: "Creator",
      status: "Normal",
      avatar: "/img/avatars/a1.jpg",           // จะเปลี่ยนเป็น random ก็ได้
    };

    nextUsers.push(newUser);
    byName.set(key, newUser);
    nextIndex++;
  }

  safeSet(USERS_KEY, nextUsers);
}
