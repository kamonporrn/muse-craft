import { Module, forwardRef } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { BackupService } from "./backup.service";
import { UsersService } from "./services/users.service";
import { ProductsService } from "./services/products.service";
import { OrdersService } from "./services/orders.service";
import { AdminLogsService } from "./services/admin-logs.service";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [forwardRef(() => RealtimeModule)],
  providers: [
    DatabaseService,
    BackupService,
    UsersService,
    ProductsService,
    OrdersService,
    AdminLogsService,
  ],
  exports: [
    DatabaseService,
    BackupService,
    UsersService,
    ProductsService,
    OrdersService,
    AdminLogsService,
  ],
})
export class DatabaseModule {}
