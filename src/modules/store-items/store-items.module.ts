import { Module } from '@nestjs/common';
import { StoreItemsController } from './controllers/store-items.controller';
import { StoreItemsService } from './services/models.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItem } from './entities/storage/store-item';
import { StoreItemMedia } from './entities/storage/store-item-media';
import { ItemRepository } from './repositories/store-items.repository';
import { AppWriteModule } from '@services/appwrite/appwrite.module';
import { GeneralController } from './controllers/general.controller';
import { ItemMediaRepository } from './repositories/store-items-media.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreItem, StoreItemMedia]),
    AppWriteModule,
  ],
  controllers: [StoreItemsController, GeneralController],
  providers: [
    ItemRepository,
    ItemMediaRepository,
    StoreItemsService
  ],
})
export class StoreItemsModule {}
