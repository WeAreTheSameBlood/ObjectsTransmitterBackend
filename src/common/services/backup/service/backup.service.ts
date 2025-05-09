import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { createHash } from 'crypto';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';
import { AppWriteStorageService, LoggerService } from '@services';
import { DataSource } from 'typeorm';

@Injectable()
export class BackupService {
  private lastChecksum: string | null = null;

  constructor(
    private readonly storage: AppWriteStorageService,
    private readonly logger: LoggerService,
    private readonly dataSource: DataSource,
  ) {}

  // MARK: - Handle
  //        ┌───────────── sec      (0–59)
  //        │ ┌─────────── mins     (0–59)
  //        │ │ ┌───────── hours    (0–23)
  //        │ │ │ ┌─────── days     (1–31)
  //        │ │ │ │ ┌───── week day (0–6  Sun–Sat)
  //        * * * * * 
  @Cron('*/15 * * * *') // 15 min
  async handleBackup() {
    try {
      // Check if DB is empty
      const result = await this.dataSource.query(
        `SELECT COALESCE(SUM(n_live_tup),0) AS total
         FROM pg_stat_user_tables
         WHERE schemaname = 'public';`
      );
      const totalRows = Number(result[0].total);
      if (totalRows === 0) {
        this.logger.info('Database empty – skipping backup.');
        return;
      }

      // Generate dump to temp file
      const timestamp = Date.now();
      const dumpPath = join(tmpdir(), `db-backup-${timestamp}.sql`);
      await this.pgDumpToFile(dumpPath);

      // Calc checksum (hash)
      const buf = await fs.readFile(dumpPath);
      const checksum = createHash('sha256').update(buf).digest('hex');

      // Check hash changes
      if (checksum !== this.lastChecksum) {
        this.logger.info(`Database changed, uploading backup ${timestamp}.sql`);

        const iso = new Date(timestamp).toISOString();                  // "2025-05-09T11:13:00.037Z"
        const safe = iso.replace(/[:\-]/g, '').replace(/\.\d+Z$/, '');  // "20250509T111300"
        const remoteKey = `db_backup_${safe}.sql`;

        await this.storage.uploadBackupFile(buf, remoteKey);
        this.lastChecksum = checksum;
        this.logger.info(`Backup uploaded as ${remoteKey}`);
      } else {
        this.logger.info('No changes since last backup, skipping upload.');
      }

      // Clean temp files
      await fs.unlink(dumpPath);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const stack =
        error instanceof Error && error.stack ? error.stack : undefined;
      this.logger.error(`Backup failed: ${msg}`, stack);
    }
  }

  // MARK: - Private
  private pgDumpToFile(outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = [
        '--clean',
        '--if-exists',
        '-h',
        process.env.POSTGRES_HOST!,
        '-p',
        process.env.POSTGRES_PORT!,
        '-U',
        process.env.POSTGRES_USER!,
        '-F',
        'p',
        '-f',
        outputPath,
        process.env.POSTGRES_DATABASE!,
      ];
      const pgDump = spawn('pg_dump', args, {
        env: {
          ...process.env,
          PGPASSWORD: process.env.POSTGRES_PASSWORD,
        },
      });

      pgDump.on('error', reject);
      pgDump.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`pg_dump exited with ${code}`));
      });
    });
  }
}