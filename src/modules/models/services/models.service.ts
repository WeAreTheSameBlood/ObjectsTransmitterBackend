import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ModelFile } from "../entities/storage/model-file";
import { AppWriteStorageService } from '@services';
import { ModelsRepository } from '../repositories/models.repository';
import { ModelAddDTO } from '../entities/dtos';
import { UsersRepository } from '@modules/users/repositories/users.repository';

@Injectable()
export class ModelsService {
  // MARK: - Init
  constructor(
    private modelsRepo: ModelsRepository,
    private usersRepo: UsersRepository,
    private storageService: AppWriteStorageService,
  ) {}

  // MARK: - Add New
  async addNewModel(
    file: Express.Multer.File,
    objectDto: ModelAddDTO,
  ): Promise<ModelFile> {
    const fileId = await this.storageService.uploadModelFile(file);
    const sizeInMb = file.size / (1024 * 1024);     // byte --> kb --> Mb

    const obj = this.modelsRepo.create({
      name: objectDto.name,
      model_file_url_key: fileId,
      size: sizeInMb,
    });

    if (objectDto.owner_id) {
      const owner = await this.usersRepo.findOne(objectDto.owner_id);
      if (!owner) {
        throw new HttpException('Owner not found', HttpStatus.NOT_FOUND);
      }
      obj.owner = owner;
    }

    return this.modelsRepo.save(obj);
  }

  // MARK: - Find All
  async findAll(): Promise<ModelFile[]> {
    return this.modelsRepo.findAll();
  }

  // MARK: - Find One By ID
  async findOneById(modelId: string): Promise<ModelFile | null> {
    return this.modelsRepo.findOneById(modelId);
  }

  // MARK: - Find One By ID
  async findAllByUser(userId: string): Promise<ModelFile[]> {
    return this.modelsRepo.findAllByUser(userId);
  }

  // MARK: - Delete
  async deleteModel(
    modelId: string
  ): Promise<{ success: boolean }> {
    const model = await this.modelsRepo.findOneById(modelId);
    if (model) {
      const resultDB = await this.modelsRepo.delete(modelId);
      await this.storageService.deleteFile(model.model_file_url_key);
      return { success: resultDB }
    } else {
      throw new HttpException(
        'Model with entered Id not found',
        HttpStatus.NOT_FOUND
      )
    }
  }
}
