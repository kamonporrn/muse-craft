// lib/auth.ts
export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("musecraft.signedIn") === "1";
}

export function getUserName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("musecraft.userName") || "Muse User";
}

export function getRole(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("musecraft.role") || "";
}
