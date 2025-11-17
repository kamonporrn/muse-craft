// lib/users/types.ts
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

export type Credential = {
  email: string;
  password: string;
  userId: string;
};

export type Order = {
  id: string;
  buyerId: string;
  items: { name: string; price: number; qty: number }[];
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
