import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItemsModule } from '@src/modules/store-items/store-items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppWriteModule } from '@common/services/appwrite/appwrite.module';
import { LoggerModule } from '@common/services/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupModule } from '@common/services/backup/backup.module';
import { HealthModule } from './modules/health/health.module';

const featuresModules = [StoreItemsModule, HealthModule];
const internalModules = [AppWriteModule, LoggerModule, BackupModule];

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ...featuresModules,
    ...internalModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
