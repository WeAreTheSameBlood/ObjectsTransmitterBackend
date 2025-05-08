import { Injectable } from '@nestjs/common';
import { Storage } from 'node-appwrite';
import { AppWriteBaseClientService } from './appwrite-base-client.service';
import { IAppWriteStorageManager } from '../interfaces/appwrite-storage-manager.interface';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileFromPath } from 'formdata-node/file-from-path';

@Injectable()
export class AppWriteStorageService implements IAppWriteStorageManager {
  // MARK: - Properties
  private storage: Storage;

  // MARK: - Init
  constructor(private clientSvc: AppWriteBaseClientService) {
    this.storage = new Storage(this.clientSvc.client);
  }

  // MARK: - Upload
  public async uploadModelFile(
    file: Express.Multer.File,
    bucketId: string = process.env.APPWRITE_BUCKET_ID!,
  ): Promise<string> {
    const fileId = uuidv4();

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
      bucketId,
      fileId,
      dataFile as any,
    );

    // Delete temp file
    await fs.unlink(tempPath);
    return response.$id;
  }

  // MARK: - Download
  public getFileDownloadUrl(bucketId: string, fileId: string): string {
    const endpoint = this.clientSvc.client.config.endpoint;
    const project =  this.clientSvc.client.config.project;

    return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/download?project=${project}`;
  }
}
