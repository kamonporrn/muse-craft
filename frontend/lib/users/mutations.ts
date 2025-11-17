// lib/users/mutations.ts
import { User, Credential, Status } from "./types";
import { getUsers } from "./queries";
import { safeSet, CREDS_KEY, USERS_KEY, safeGet } from "./store";

/** Create or Update user */
export function upsertUser(user: User) {
  const list = getUsers();
  const idx = list.findIndex(u => u.id === user.id);

  if (idx >= 0) list[idx] = user;
  else list.push(user);

  safeSet(USERS_KEY, list);
  return user;
}

/** Soft suspend */
export function suspendUser(id: string) {
  updateStatus(id, "Suspended");
}

export function restoreUser(id: string) {
  updateStatus(id, "Normal");
}

export function deleteUserSoft(id: string) {
  updateStatus(id, "Deleted");
}

function updateStatus(id: string, status: Status) {
  const list = getUsers().map(u =>
    u.id === id ? { ...u, status } : u
  );
  safeSet(USERS_KEY, list);
}

/** Hard delete (remove credential too) */
export function removeUserHard(id: string) {
  const newUsers = getUsers().filter(u => u.id !== id);
  safeSet(USERS_KEY, newUsers);

  const creds = safeGet<Credential[]>(CREDS_KEY, []);
  const newCreds = creds.filter(c => c.userId !== id);
  safeSet(CREDS_KEY, newCreds);
}
