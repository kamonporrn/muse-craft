import { Injectable, Inject, forwardRef, Optional } from "@nestjs/common";
import { DatabaseService } from "../database.service";
import { Order } from "../entities/order.entity";
import { RealtimeGateway } from "../../realtime/realtime.gateway";
import { ProductsService } from "./products.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DatabaseService,
    @Optional()
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway?: RealtimeGateway,
    @Optional()
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService?: ProductsService
  ) {}

  findAll(): Order[] {
    return this.db.readFile<Order>("orders");
  }

  findById(id: string): Order | null {
    const orders = this.findAll();
    return orders.find((o) => o.id === id) || null;
  }

  findByBuyer(buyerId: string): Order[] {
    const orders = this.findAll();
    return orders.filter((o) => o.buyerId === buyerId);
  }

  findByCreator(creatorName: string): Order[] {
    const orders = this.findAll();
    if (!this.productsService) return [];
    
    const products = this.productsService.findAll();
    const productMap = new Map(products.map(p => [p.id, p]));
    
    // Filter orders that have at least one item from this creator
    return orders.filter(order => {
      return order.items.some(item => {
        const product = productMap.get(item.productId);
        return product && product.author === creatorName;
      });
    });
  }

  create(order: Omit<Order, "id" | "dateISO" | "createdAt" | "updatedAt">): Order {
    const orders = this.findAll();
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const newOrder: Order = {
      ...order,
      id: `o-${Date.now()}`,
      total,
      dateISO: new Date().toISOString(),
      status: order.status || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    const success = this.db.writeFile("orders", orders);
    if (!success) {
      throw new Error("Failed to save order to database");
    }
    this.realtimeGateway?.broadcastOrderUpdate("create", newOrder);
    return newOrder;
  }

  update(id: string, updates: Partial<Order>): Order | null {
    const orders = this.findAll();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const success = this.db.writeFile("orders", orders);
    if (!success) {
      throw new Error("Failed to update order in database");
    }
    this.realtimeGateway?.broadcastOrderUpdate("update", orders[index]);
    return orders[index];
  }

  updateStatus(
    id: string,
    status: Order["status"]
  ): Order | null {
    return this.update(id, { status });
  }

  delete(id: string): boolean {
    const orders = this.findAll();
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length === orders.length) return false;

    const success = this.db.writeFile("orders", filtered);
    if (!success) {
      throw new Error("Failed to delete order from database");
    }
    this.realtimeGateway?.broadcastOrderUpdate("delete", id);
    return true;
  }
}

