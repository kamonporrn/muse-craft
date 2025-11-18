import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { BackupController } from "./backup/backup.controller";
import { UsersController } from "./users/users.controller";
import { ProductsController } from "./products/products.controller";
import { OrdersController } from "./orders/orders.controller";
import { AdminLogsController } from "./admin-logs/admin-logs.controller";
import { RealtimeModule } from "./realtime/realtime.module";

@Module({
  imports: [DatabaseModule, RealtimeModule],
  controllers: [
    AppController,
    BackupController,
    UsersController,
    ProductsController,
    OrdersController,
    AdminLogsController,
  ],
  providers: [AppService],
})
export class AppModule {}
