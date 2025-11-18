export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  buyerId: string; // user.id
  items: OrderItem[];
  total: number;
  dateISO: string;
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}



