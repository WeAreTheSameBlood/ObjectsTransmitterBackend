import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsModule } from '@modules/objects/objects.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AppWriteModule } from '@common/services/appwrite/appwrite.module';
import { LoggerModule } from './common/services/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'objects_transmitter_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ObjectsModule,
    UsersModule,
    AuthModule,
    AppWriteModule,
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
