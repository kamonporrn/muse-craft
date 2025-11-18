import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Body() order: Omit<Order, "id" | "dateISO" | "createdAt" | "updatedAt">) {
    return this.ordersService.create(order);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updates: Partial<Order>) {
    return this.ordersService.update(id, updates);
  }

  @Put(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: Order["status"] }
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.ordersService.delete(id);
  }
}



