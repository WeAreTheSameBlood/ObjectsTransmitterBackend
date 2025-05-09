import { Injectable } from '@nestjs/common';
import { Storage } from 'node-appwrite';
import { AppWriteBaseClientService } from './appwrite-base-client.service';
import { IAppWriteStorageManager } from '../interfaces/appwrite-storage-manager.interface';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileFromPath } from 'formdata-node/file-from-path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppWriteStorageService implements IAppWriteStorageManager {
  // MARK: - Properties
  private storage: Storage;
  private bucketId: string = process.env.APPWRITE_BUCKET_ID!;
  private backupBucketId: string = process.env.APPWRITE_BACKUP_BUCKET_ID!;

  // MARK: - Init
  constructor(private clientService: AppWriteBaseClientService) {
    this.storage = new Storage(this.clientService.client);
  }

  // MARK: - Upload
  public async uploadModelFile(file: Express.Multer.File): Promise<string> {
    const fileId: string = uuidv4();

    // Buffer --> temp file
    const ext = file.originalname.includes('.')
      ? file.originalname.substring(file.originalname.lastIndexOf('.'))
      : '';
    const tempPath = join(tmpdir(), `${fileId}${ext}`);
    await fs.writeFile(tempPath, file.buffer);

    // Convert temp file -->  File object
    const dataFile = await fileFromPath(tempPath);

    // Request to Bucket
    const response = await this.storage.createFile(
      this.bucketId,
      fileId,
      dataFile as any,
    );

    // Delete temp file
    await fs.unlink(tempPath);
    return response.$id;
  }

  // MARK: - Download
  public getFileDownloadUrl(fileId: string): string {
    const endpoint = this.clientService.client.config.endpoint;
    const project = this.clientService.client.config.project;

    return `${endpoint}/storage/buckets/${this.bucketId}/files/${fileId}/download?project=${project}`;
  }

  // MARK: - Backup Data
  public async uploadBackupFile(
    data: Buffer,
    remoteKey: string,
  ): Promise<string> {
    const tmp = join(tmpdir(), remoteKey.replace(/\//g, '_'));
    await fs.writeFile(tmp, data);

    const file = await fileFromPath(tmp);
    const result = await this.storage.createFile(
      this.backupBucketId,
      remoteKey,
      file as any
    );

    await fs.unlink(tmp);
    return result.$id;
  }
}
