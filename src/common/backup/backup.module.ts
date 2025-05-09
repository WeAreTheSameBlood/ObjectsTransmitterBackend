import { Module } from '@nestjs/common';
import { BackupService } from './service/service.service';
import { AppWriteStorageService } from '@services/appwrite';
import { AppWriteModule } from '../services/appwrite/appwrite.module';

@Module({
  imports:[AppWriteModule],
  providers: [
    BackupService,
    AppWriteStorageService
  ],
})
export class BackupModule {}
