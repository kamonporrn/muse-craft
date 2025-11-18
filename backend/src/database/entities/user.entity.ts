export type Role = "Creator" | "Collector" | "Admin";
export type Status = "Normal" | "Suspended" | "Deleted";

export interface User {
  id: string;
  accountId: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  avatar?: string;
  storeName?: string;
  phone?: string;
  address?: string;
}

export interface Credential {
  email: string;
  password: string;
  userId: string;
}



