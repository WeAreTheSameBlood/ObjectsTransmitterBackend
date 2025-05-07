import { Module } from '@nestjs/common';
import { ObjectsController } from './controllers/objects.controller';
import { ObjectsService } from './services/objects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectFile } from '@src/modules/objects/entities/storage/ObjectFile';
import { AppWriteManager } from '@services/appwrite/AppWriteManager';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectFile])],
  controllers: [ObjectsController],
  providers: [
    ObjectsService,
    AppWriteManager
  ],
})
export class ObjectsModule { }
