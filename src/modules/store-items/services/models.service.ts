import { Injectable } from '@nestjs/common';
import { StoreItem } from "../entities/storage/store-item";
import { AppWriteStorageService } from '@services';
import { ModelsRepository } from '../repositories/store-items.repository';
import { StoreItemAddDTO } from '../entities/dtos';

@Injectable()
export class StoreItemsService {
  // MARK: - Init
  constructor(
    private modelsRepo: ModelsRepository,
    private storageService: AppWriteStorageService,
  ) {}

  // MARK: - Add New
  async addNewItem(
    itemDto: StoreItemAddDTO,
    modelFile: Express.Multer.File,
    barcodeImageFile: Express.Multer.File,
  ): Promise<StoreItem> {
    const modelFileKey: string =    await this.storageService.uploadModelFile(modelFile);
    const barcodeImageKey: string = await this.storageService.uploadModelFile(barcodeImageFile);

    const newItem: StoreItem = this.modelsRepo.create({
      title:              itemDto.title,
      brand:              itemDto.brand,
      barcodeValue:       itemDto.barcode_value,
      barcodeFileUrlKey:  barcodeImageKey,
      modelFileUrlKey:    modelFileKey,
      amount:             Number(itemDto.amount)
    });

    return this.modelsRepo.save(newItem);
  }

  // // MARK: - Find All
  // async findAll(): Promise<StoreItem[]> {
  //   return this.modelsRepo.findAll();
  // }

  // // MARK: - Find One By ID
  // async findOneById(modelId: string): Promise<StoreItem | null> {
  //   return this.modelsRepo.findOneById(modelId);
  // }

  // // MARK: - Find One By ID
  // async findAllByUser(userId: string): Promise<StoreItem[]> {
  //   return this.modelsRepo.findAllByUser(userId);
  // }

  // // MARK: - Delete
  // async deleteModel(
  //   modelId: string
  // ): Promise<{ success: boolean }> {
  //   const model = await this.modelsRepo.findOneById(modelId);
  //   if (model) {
  //     const resultDB = await this.modelsRepo.delete(modelId);
  //     await this.storageService.deleteFile(model.model_file_url_key);
  //     return { success: resultDB }
  //   } else {
  //     throw new HttpException(
  //       'Model with entered Id not found',
  //       HttpStatus.NOT_FOUND
  //     )
  //   }
  // }
}
