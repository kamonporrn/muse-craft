import { Injectable, Logger } from "@nestjs/common";
import { DatabaseService } from "./database.service";

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a backup of all database files
   */
  createBackup(): { success: boolean; backupPath: string; timestamp: string } {
    try {
      const backupPath = this.db.createBackup();
      const timestamp = new Date().toISOString();
      
      // Cleanup old backups (keep last 10)
      this.db.cleanupBackups(10);

      return {
        success: true,
        backupPath,
        timestamp,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Backup failed: ${message}`);
      throw error;
    }
  }

  /**
   * Restore from a backup
   */
  restoreBackup(backupName: string): { success: boolean; message: string } {
    try {
      const backupPath = this.db.listBackups().find((b) => b === backupName);
      if (!backupPath) {
        throw new Error(`Backup not found: ${backupName}`);
      }

      const fullPath = require("path").join(
        process.cwd(),
        "database",
        "backups",
        backupPath
      );
      this.db.restoreBackup(fullPath);

      return {
        success: true,
        message: `Restored from backup: ${backupName}`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Restore failed: ${message}`);
      throw error;
    }
  }

  /**
   * List all available backups
   */
  listBackups(): string[] {
    return this.db.listBackups();
  }

  /**
   * Delete a specific backup
   */
  deleteBackup(backupName: string): { success: boolean; message: string } {
    try {
      const fs = require("fs");
      const path = require("path");
      const backupPath = path.join(
        process.cwd(),
        "database",
        "backups",
        backupName
      );

      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup not found: ${backupName}`);
      }

      fs.rmSync(backupPath, { recursive: true, force: true });
      return {
        success: true,
        message: `Deleted backup: ${backupName}`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Delete backup failed: ${message}`);
      throw error;
    }
  }
}

