import { Controller, Get, Post, Delete, Body, Param, Query } from "@nestjs/common";
import { AdminLogsService } from "../database/services/admin-logs.service";
import { AdminLog } from "../database/entities/admin-log.entity";

@Controller("admin-logs")
export class AdminLogsController {
  constructor(private readonly adminLogsService: AdminLogsService) {}

  @Get()
  findAll(@Query("adminId") adminId?: string) {
    if (adminId) {
      return this.adminLogsService.findByAdmin(adminId);
    }
    return this.adminLogsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminLogsService.findById(id);
  }

  @Post()
  create(@Body() log: Omit<AdminLog, "id" | "atISO">) {
    return this.adminLogsService.create(log);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.adminLogsService.delete(id);
  }

  @Delete("admin/:adminId")
  deleteByAdmin(@Param("adminId") adminId: string) {
    const count = this.adminLogsService.deleteByAdmin(adminId);
    return { deletedCount: count };
  }
}



