import { Injectable, Inject, forwardRef, Optional } from "@nestjs/common";
import { DatabaseService } from "../database.service";
import { Product } from "../entities/product.entity";
import { RealtimeGateway } from "../../realtime/realtime.gateway";

@Injectable()
export class ProductsService {
  constructor(
    private readonly db: DatabaseService,
    @Optional()
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway?: RealtimeGateway
  ) {}

  findAll(): Product[] {
    return this.db.readFile<Product>("products");
  }

  findById(id: string): Product | null {
    const products = this.findAll();
    return products.find((p) => p.id === id) || null;
  }

  findByCategory(category: Product["category"]): Product[] {
    const products = this.findAll();
    return products.filter((p) => p.category === category);
  }

  findByAuthor(author: string): Product[] {
    const products = this.findAll();
    return products.filter((p) => p.author === author);
  }

  search(query: string): Product[] {
    const products = this.findAll();
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.author.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
  }

  create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const products = this.findAll();
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      status: product.status || "pending", // Default to pending for new products
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    const success = this.db.writeFile("products", products);
    if (!success) {
      throw new Error("Failed to save product to database");
    }
    this.realtimeGateway?.broadcastProductUpdate("create", newProduct);
    return newProduct;
  }

  findByStatus(status: Product["status"]): Product[] {
    const products = this.findAll();
    return products.filter((p) => p.status === status);
  }

  findByAuthorAndStatus(author: string, status?: Product["status"]): Product[] {
    const products = this.findAll();
    let filtered = products.filter((p) => p.author === author);
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    return filtered;
  }

  updateStatus(id: string, status: Product["status"]): Product | null {
    return this.update(id, { status });
  }

  update(id: string, updates: Partial<Product>): Product | null {
    const products = this.findAll();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const success = this.db.writeFile("products", products);
    if (!success) {
      throw new Error("Failed to update product in database");
    }
    this.realtimeGateway?.broadcastProductUpdate("update", products[index]);
    return products[index];
  }

  delete(id: string): boolean {
    const products = this.findAll();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;

    const success = this.db.writeFile("products", filtered);
    if (!success) {
      throw new Error("Failed to delete product from database");
    }
    this.realtimeGateway?.broadcastProductUpdate("delete", id);
    return true;
  }
}

