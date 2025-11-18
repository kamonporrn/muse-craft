// lib/auth.ts
// Re-export auth functions from lib/users/auth
export { isSignedIn, getUserName, getRole, validateUser, setSessionFromUser, clearSession } from "./users/auth";

