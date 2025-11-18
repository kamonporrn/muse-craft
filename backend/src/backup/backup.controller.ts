import { Controller, Get, Post, Delete, Param, Body } from "@nestjs/common";
import { BackupService } from "../database/backup.service";

@Controller("backup")
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  createBackup() {
    return this.backupService.createBackup();
  }

  @Get()
  listBackups() {
    return {
      backups: this.backupService.listBackups(),
    };
  }

  @Post("restore/:backupName")
  restoreBackup(@Param("backupName") backupName: string) {
    return this.backupService.restoreBackup(backupName);
  }

  @Delete(":backupName")
  deleteBackup(@Param("backupName") backupName: string) {
    return this.backupService.deleteBackup(backupName);
  }
}



