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
import { OrdersService } from "../database/services/orders.service";
import { Order } from "../database/entities/order.entity";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query("buyerId") buyerId?: string, @Query("creatorName") creatorName?: string) {
    if (buyerId) {
      return this.ordersService.findByBuyer(buyerId);
    }
    if (creatorName) {
      return this.ordersService.findByCreator(creatorName);
    }
    return this.ordersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    const order = this.ordersService.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  @Post()
  create(@Body() order: Omit<Order, "id" | "dateISO" | "createdAt" | "updatedAt">) {
    try {
      if (!order.buyerId || !order.items || order.items.length === 0) {
        throw new BadRequestException("Missing required fields: buyerId, items");
      }
      return this.ordersService.create(order);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error instanceof Error ? error.message : "Failed to create order");
    }
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updates: Partial<Order>) {
    const result = this.ordersService.update(id, updates);
    if (!result) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return result;
  }

  @Put(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: Order["status"] }
  ) {
    if (!body.status) {
      throw new BadRequestException("Status is required");
    }
    const result = this.ordersService.updateStatus(id, body.status);
    if (!result) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return result;
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    const result = this.ordersService.delete(id);
    if (!result) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return { success: true, message: `Order ${id} deleted successfully` };
  }
}



