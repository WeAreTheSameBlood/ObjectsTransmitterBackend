import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
    AppWriteBaseClientService,
    AppWriteAuthService,
    AppWriteStorageService
} from './index';

@Module({
  imports: [ConfigModule],
  providers: [
    AppWriteBaseClientService,
    AppWriteAuthService,
    AppWriteStorageService,
  ],
  exports: [
    AppWriteStorageService,
    AppWriteAuthService
  ],
})
export class AppWriteModule { }
