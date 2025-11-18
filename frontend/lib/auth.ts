// lib/auth.ts
// Re-export auth functions from lib/users/auth for backward compatibility
export { isSignedIn, getUserName, getRole, setSessionFromUser, clearSession, validateUser } from "./users/auth";

