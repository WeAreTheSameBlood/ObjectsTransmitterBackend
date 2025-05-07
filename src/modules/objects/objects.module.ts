import { Module } from '@nestjs/common';
import { ObjectsController } from './controllers/objects.controller';
import { ObjectsService } from './services/objects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectFile } from '@src/modules/objects/entities/storage/ObjectFile';
import { AppWriteManager } from '@services/appwrite/AppWriteManager';
import { ObjectsRepository } from './repositories/objects.repository';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectFile]),
    UsersModule,
  ],
  controllers: [ObjectsController],
  providers: [
    ObjectsRepository,
    ObjectsService,
    AppWriteManager,
  ],
})
export class ObjectsModule { }
