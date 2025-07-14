import { StoreItemMedia } from '../entities/storage/store-item-media';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreItem } from "../entities/storage/store-item";
import { AppWriteStorageService } from '@services';
import { ItemRepository } from '../repositories/store-items.repository';
import { StoreItemAddDTO } from '../entities/dtos';
import { ItemMediaRepository } from '../repositories/store-items-media.repository';

@Injectable()
export class StoreItemsService {
  // MARK: - Init
  constructor(
    private modelsRepo: ItemRepository,
    private modelsMediaRepo: ItemMediaRepository,
    private storageService: AppWriteStorageService,
  ) {}

  // MARK: - Add New
  async addNewItem(
    itemDto: StoreItemAddDTO,
    modelFile: Express.Multer.File,
    titleImage: Express.Multer.File,
    additionalImages: Express.Multer.File[],
  ): Promise<StoreItem> {
    const modelFileKey: string =
      await this.storageService.uploadModelFile(modelFile);
    
    const titleImageKey: string =
      await this.storageService.uploadModelFile(titleImage);
    

    const additionalImageKeys: string[] = await Promise.all(
      additionalImages.map(file => this.storageService.uploadModelFile(file))
    );

    const mediaEntities: StoreItemMedia[] = additionalImageKeys.map(key => {
      const media = this.modelsMediaRepo.create({ media_file_url_key: key })
      this.modelsMediaRepo.save(media);
      return media;
    });

    const newItem: StoreItem = this.modelsRepo.create({
      title:              itemDto.title,
      modelFileUrlKey:    modelFileKey,
      titleImageUrlKey:   titleImageKey,
      price:              Number(itemDto.price),
      categories:         itemDto.categories,
      media:              mediaEntities,
    });

    mediaEntities.forEach((media) => (media.store_item = newItem));

    return this.modelsRepo.save(newItem);
  }

  // MARK: - Find All
  async findAll(): Promise<StoreItem[]> {
    return this.modelsRepo.findAll();
  }

  // MARK: - Find One By ID
  async findOneById(modelId: string): Promise<StoreItem | null> {
    return this.modelsRepo.findOneById(modelId);
  }

  // MARK: - Delete
  async deleteModel(modelId: string): Promise<{ success: boolean }> {
    const storeItem = await this.modelsRepo.findOneById(modelId);

    if (storeItem) {
      const resultDB = await this.modelsRepo.delete(modelId);
      await this.storageService.deleteFile(storeItem.modelFileUrlKey);
      return { success: resultDB };
    } else {
      throw new HttpException(
        'Model with entered Id not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
