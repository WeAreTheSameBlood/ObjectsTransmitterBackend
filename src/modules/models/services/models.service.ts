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
    private objectRepo: ModelsRepository,
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

    const obj = this.objectRepo.create({
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

    return this.objectRepo.save(obj);
  }

  // MARK: - Find All
  async findAll(): Promise<ModelFile[]> {
    return this.objectRepo.findAll();
  }

  // MARK: - Find One By ID
  async findOneById(modelId: string): Promise<ModelFile | null> {
    return this.objectRepo.findOneById(modelId);
  }

  // MARK: - Find One By ID
  async findAllByUser(userId: string): Promise<ModelFile[]> {
    return this.objectRepo.findAllByUser(userId);
  }
}
