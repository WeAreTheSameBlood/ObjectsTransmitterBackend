import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsModule } from './objects/objects.module';
import { AppWriteManager } from './services/appwrite/appwrite-manager.service';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [],
  providers: [
    AppWriteManager
  ],
})
export class AppModule {}
