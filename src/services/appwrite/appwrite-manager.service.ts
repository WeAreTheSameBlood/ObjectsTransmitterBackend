import { Injectable } from '@nestjs/common';
import { Client, Storage } from 'node-appwrite';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileFromPath } from 'formdata-node/file-from-path';

@Injectable()
export class AppWriteManager {
  // MARK: - Properties
  private client: Client;
  private storage: Storage;

  // MARK: - Init
  constructor(private configService: ConfigService) {
    this.client = new Client()
      .setEndpoint( this.configService.get<string>('APPWRITE_ENDPOINT')!)
      .setProject(  this.configService.get<string>('APPWRITE_PROJECT_ID')!)
      .setKey(      this.configService.get<string>('APPWRITE_API_KEY')!);
      
    this.storage = new Storage(this.client);
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
  public getFileDownloadUrl(
    bucketId: string,
    fileId: string
  ): string {
    const endpoint =  this.configService.get<string>('APPWRITE_ENDPOINT');
    const project =   this.configService.get<string>('APPWRITE_PROJECT_ID');
    
    return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/download?project=${project}`;
  }
}
