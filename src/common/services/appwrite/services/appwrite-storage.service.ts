import { Injectable } from '@nestjs/common';
import { Storage } from 'node-appwrite';
import { AppWriteBaseClientService } from './appwrite-base-client.service';
import { IAppWriteStorageManager } from '../interfaces/appwrite-storage-manager.interface';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileFromPath } from 'formdata-node/file-from-path';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from "@common/services/logger/service/logger-service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import { InputFile } from 'node-appwrite/file';
const { InputFile } = require('node-appwrite/file');

@Injectable()
export class AppWriteStorageService implements IAppWriteStorageManager {
  // MARK: - Properties
  private storage: Storage;
  private bucketId: string = process.env.APPWRITE_BUCKET_ID!;
  private backupBucketId: string = process.env.APPWRITE_BACKUP_BUCKET_ID!;

  // MARK: - Init
  constructor(
    private clientService: AppWriteBaseClientService,
    private readonly logger: LoggerService
  ) {
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
    // const dataFile = await fileFromPath(tempPath);
    const dataFile: any = InputFile.fromPath(tempPath, file.originalname);

    // Request to Bucket
    const response = await this.storage.createFile(
      this.bucketId,
      fileId,
      dataFile,
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

  // MARK: - Delete
  public async deleteFile(
    fileId: string
  ): Promise<boolean> {
    try {
      await this.storage.deleteFile(this.bucketId, fileId);
      this.logger.info('File deleted form Storage', { fileId: fileId });
      return true;
    } catch (error) {
      this.logger.error("File didn't deleted form Storage", {
        fileId: fileId,
        error,
      });
      return false;
    }
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
      file as any,
    );

    await fs.unlink(tmp);
    return result.$id;
  }
}
