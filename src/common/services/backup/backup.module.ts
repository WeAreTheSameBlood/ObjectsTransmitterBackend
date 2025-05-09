import { Module } from '@nestjs/common';
import { BackupService } from './service/backup.service';
import { AppWriteStorageService } from '@services/appwrite';
import { AppWriteModule } from '../appwrite/appwrite.module';

@Module({
  imports:[AppWriteModule],
  providers: [
    BackupService,
    AppWriteStorageService
  ],
})
export class BackupModule {}
