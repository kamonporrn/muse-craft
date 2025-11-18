import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly dbDir = path.join(process.cwd(), "database", "data");
  private readonly backupDir = path.join(process.cwd(), "database", "backups");

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
      this.logger.log(`Created database directory: ${this.dbDir}`);
    }
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.logger.log(`Created backup directory: ${this.backupDir}`);
    }
  }

  /**
   * Read data from JSON file
   */
  readFile<T>(filename: string, defaultValue: T[] = []): T[] {
    const filePath = path.join(this.dbDir, `${filename}.json`);
    try {
      if (!fs.existsSync(filePath)) {
        this.writeFile(filename, defaultValue);
        return defaultValue;
      }
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T[];
    } catch (error) {
      this.logger.error(`Error reading file ${filename}: ${error instanceof Error ? error.message : String(error)}`);
      return defaultValue;
    }
  }

  /**
   * Write data to JSON file
   */
  writeFile<T>(filename: string, data: T[]): void {
    const filePath = path.join(this.dbDir, `${filename}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      this.logger.error(`Error writing file ${filename}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Create backup of all database files
   */
  createBackup(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);
    
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const files = fs.readdirSync(this.dbDir);
    let backedUpFiles = 0;

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const sourcePath = path.join(this.dbDir, file);
        const destPath = path.join(backupPath, file);
        fs.copyFileSync(sourcePath, destPath);
        backedUpFiles++;
      }
    });

    this.logger.log(`Backup created: ${backupPath} (${backedUpFiles} files)`);
    return backupPath;
  }

  /**
   * Restore from backup
   */
  restoreBackup(backupPath: string): void {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup path does not exist: ${backupPath}`);
    }

    const files = fs.readdirSync(backupPath);
    let restoredFiles = 0;

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const sourcePath = path.join(backupPath, file);
        const destPath = path.join(this.dbDir, file);
        fs.copyFileSync(sourcePath, destPath);
        restoredFiles++;
      }
    });

    this.logger.log(`Restored ${restoredFiles} files from backup: ${backupPath}`);
  }

  /**
   * List all available backups
   */
  listBackups(): string[] {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }
    return fs
      .readdirSync(this.backupDir)
      .filter((item) => {
        const itemPath = path.join(this.backupDir, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .sort()
      .reverse(); // Most recent first
  }

  /**
   * Delete old backups (keep only last N backups)
   */
  cleanupBackups(keepCount: number = 10): void {
    const backups = this.listBackups();
    if (backups.length <= keepCount) {
      return;
    }

    const toDelete = backups.slice(keepCount);
    toDelete.forEach((backup) => {
      const backupPath = path.join(this.backupDir, backup);
      fs.rmSync(backupPath, { recursive: true, force: true });
      this.logger.log(`Deleted old backup: ${backup}`);
    });
  }
}


