// lib/users/auth.ts
import { getUsers } from "./queries";
import { safeGet, CREDS_KEY } from "./store";
import { Credential, User } from "./types";

export function validateUser(email: string, password: string) {
  const creds = safeGet<Credential[]>(CREDS_KEY, []);
  const cred = creds.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() &&
      c.password === password
  );

  if (!cred) return null;

  const user = getUsers().find((u) => u.id === cred.userId);
  if (!user) return null;

  if (user.status === "Suspended") return { ...user, error: "Suspended" };
  if (user.status === "Deleted") return { ...user, error: "Deleted" };

  return user;
}

/** เก็บ session แบบง่ายจาก User (เรียกหลังจาก login สำเร็จ) */
export function setSessionFromUser(u: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem("musecraft.signedIn", "true"); // ✅ ใช้ "true"
  localStorage.setItem("musecraft.userName", u.name);
  localStorage.setItem("musecraft.role", String(u.role).toLowerCase());
  localStorage.setItem("musecraft.roleRaw", u.role);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("musecraft.signedIn");
  localStorage.removeItem("musecraft.userName");
  localStorage.removeItem("musecraft.role");
  localStorage.removeItem("musecraft.roleRaw");
}

export function isSignedIn(): boolean {
  // ✅ ให้เช็ค "true" ให้ตรงกับ setSessionFromUser
  return (
    typeof window !== "undefined" &&
    localStorage.getItem("musecraft.signedIn") === "true"
  );
}

export function getUserName(): string {
  if (typeof window === "undefined") return "Muse User";
  return localStorage.getItem("musecraft.userName") || "Muse User";
}

export function getRole(): string {
  return typeof window !== "undefined"
    ? localStorage.getItem("musecraft.role") || ""
    : "";
}
