import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectFile } from '@models/storage/object.file';
import { AppWriteManager } from '@services/appwrite/appwrite-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectFile])],
  controllers: [ObjectsController],
  providers: [
    ObjectsService,
    AppWriteManager
  ],
})
export class ObjectsModule { }
