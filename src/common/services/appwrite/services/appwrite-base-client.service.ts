import { Injectable } from '@nestjs/common';
import { Client } from 'node-appwrite';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppWriteBaseClientService {
  // MARK: - Properties
  public readonly client: Client;

  // MARK: - Init
  constructor(private cfg: ConfigService) {
    this.client = new Client()
      .setEndpoint( cfg.get<string>('APPWRITE_ENDPOINT')!)
      .setProject(  cfg.get<string>('APPWRITE_PROJECT_ID')!)
      .setKey(      cfg.get<string>('APPWRITE_API_KEY')!);
  }
}
