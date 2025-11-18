import { Injectable, Inject, forwardRef, Optional } from "@nestjs/common";
import { DatabaseService } from "../database.service";
import { AdminLog } from "../entities/admin-log.entity";
import { RealtimeGateway } from "../../realtime/realtime.gateway";

@Injectable()
export class AdminLogsService {
  constructor(
    private readonly db: DatabaseService,
    @Optional()
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway?: RealtimeGateway
  ) {}

  findAll(): AdminLog[] {
    return this.db.readFile<AdminLog>("admin-logs");
  }

  findById(id: string): AdminLog | null {
    const logs = this.findAll();
    return logs.find((l) => l.id === id) || null;
  }

  findByAdmin(adminId: string): AdminLog[] {
    const logs = this.findAll();
    return logs
      .filter((l) => l.adminId === adminId)
      .sort(
        (a, b) =>
          new Date(b.atISO).getTime() - new Date(a.atISO).getTime()
      );
  }

  create(log: Omit<AdminLog, "id" | "atISO">): AdminLog {
    const logs = this.findAll();
    const newLog: AdminLog = {
      ...log,
      id: `L-${Date.now()}`,
      atISO: new Date().toISOString(),
    };
    logs.push(newLog);
    this.db.writeFile("admin-logs", logs);
    this.realtimeGateway?.broadcastAdminLogUpdate("create", newLog);
    return newLog;
  }

  delete(id: string): boolean {
    const logs = this.findAll();
    const filtered = logs.filter((l) => l.id !== id);
    if (filtered.length === logs.length) return false;

    this.db.writeFile("admin-logs", filtered);
    this.realtimeGateway?.broadcastAdminLogUpdate("delete", id);
    return true;
  }

  deleteByAdmin(adminId: string): number {
    const logs = this.findAll();
    const filtered = logs.filter((l) => l.adminId !== adminId);
    const deletedCount = logs.length - filtered.length;
    this.db.writeFile("admin-logs", filtered);
    return deletedCount;
  }
}

