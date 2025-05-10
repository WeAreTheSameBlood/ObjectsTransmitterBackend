import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from '@modules/models/models.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AppWriteModule } from '@common/services/appwrite/appwrite.module';
import { LoggerModule } from '@common/services/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupModule } from '@src/common/services/backup/backup.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type:     'postgres',
    //   host:     process.env.POSTGRES_HOST!,
    //   port:     process.env.POSTGRES_PORT! as unknown as number,
    //   username: process.env.POSTGRES_USER!,
    //   password: process.env.POSTGRES_PASSWORD!,
    //   database: process.env.POSTGRES_DATABASE!,
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ModelsModule,
    UsersModule,
    AuthModule,
    AppWriteModule,
    LoggerModule,
    ScheduleModule.forRoot(),
    BackupModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
