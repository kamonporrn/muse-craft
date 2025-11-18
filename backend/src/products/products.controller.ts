import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { ProductsService } from "../database/services/products.service";
import { Product } from "../database/entities/product.entity";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query("category") category?: string,
    @Query("author") author?: string,
    @Query("search") search?: string,
    @Query("status") status?: string
  ) {
    if (search) {
      return this.productsService.search(search);
    }
    if (status) {
      return this.productsService.findByStatus(status as Product["status"]);
    }
    if (category) {
      return this.productsService.findByCategory(
        category as Product["category"]
      );
    }
    if (author) {
      const authorProducts = this.productsService.findByAuthor(author);
      // If status is also provided, filter by status
      if (status) {
        return authorProducts.filter((p) => p.status === status);
      }
      return authorProducts;
    }
    return this.productsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  create(@Body() product: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    return this.productsService.create(product);
  }

  // Put :id/status BEFORE :id to ensure proper route matching
  @Put(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: Product["status"] }
  ) {
    const result = this.productsService.updateStatus(id, body.status);
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updates: Partial<Product>) {
    return this.productsService.update(id, updates);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.productsService.delete(id);
  }
}



