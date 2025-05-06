import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectModel } from '@models/storage/object.model';
import { AppWriteManager } from '@services/appwrite/appwrite-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectModel])],
  controllers: [ObjectsController],
  providers: [
    ObjectsService,
    AppWriteManager
  ],
})
export class ObjectsModule { }
