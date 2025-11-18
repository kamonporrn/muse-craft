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
  BadRequestException,
  HttpException,
  HttpStatus,
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
    const product = this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Post()
  create(@Body() product: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    try {
      if (!product.name || !product.author || !product.category || product.price === undefined) {
        throw new BadRequestException("Missing required fields: name, author, category, price");
      }
      return this.productsService.create(product);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error instanceof Error ? error.message : "Failed to create product");
    }
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
    const result = this.productsService.update(id, updates);
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    const result = this.productsService.delete(id);
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { success: true, message: `Product ${id} deleted successfully` };
  }
}



