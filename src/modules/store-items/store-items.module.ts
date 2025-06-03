import { Module } from '@nestjs/common';
import { StoreItemsController } from './controllers/store-items.controller';
import { StoreItemsService } from './services/models.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItem } from './entities/storage/store-item';
import { StoreItemMedia } from './entities/storage/store-item-media';
import { ModelsRepository } from './repositories/store-items.repository';
import { AppWriteModule } from '@services/appwrite/appwrite.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreItem, StoreItemMedia]),
    AppWriteModule,
  ],
  controllers: [StoreItemsController],
  providers: [
    ModelsRepository,
    StoreItemsService
  ],
})
export class StoreItemsModule {}
