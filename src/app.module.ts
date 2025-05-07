import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsModule } from './modules/objects/objects.module';
import { AppWriteManager } from '@services/appwrite/AppWriteManager';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';

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
  ],
  controllers: [],
  providers: [
    AppWriteManager
  ],
})
export class AppModule {}
