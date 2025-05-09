import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from '@src/modules/models/models.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AppWriteModule } from '@common/services/appwrite/appwrite.module';
import { LoggerModule } from '@common/services/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupModule } from '@src/common/services/backup/backup.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type:     'postgres',
      host:     process.env.POSTGRES_HOST!,
      port:     process.env.POSTGRES_PORT! as unknown as number,
      username: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DATABASE!,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ModelsModule,
    UsersModule,
    AuthModule,
    AppWriteModule,
    LoggerModule,
    ScheduleModule.forRoot(),
    BackupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
