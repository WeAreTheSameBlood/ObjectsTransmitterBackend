import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectFile } from '@modules/objects/entities/storage/ObjectFile';
import { AppWriteManager } from '@services/appwrite/AppWriteManager';
import { ObjectsRepository } from '../repositories/objects.repository';
import { ObjectsAddDTO } from '../entities/dtos';
import { UsersRepository } from '@modules/users/repositories/users.repository';

@Injectable()
export class ObjectsService {
  // MARK: - Init
  constructor(
    private objectRepo: ObjectsRepository,
    private appWriteManager: AppWriteManager,
    private usersRepo: UsersRepository,
  ) {}

  // MARK: - Create
  async createObject(
    file: Express.Multer.File,
    objectDto: ObjectsAddDTO,
  ): Promise<ObjectFile> {
    const fileId = await this.appWriteManager.uploadModelFile(file);
    const sizeInMb = file.size / (1024 * 1024);     // byte --> kb --> Mb

    const obj = this.objectRepo.create({
      name: objectDto.name,
      model_file_url_key: fileId,
      size: sizeInMb,
    });
    
    if (objectDto.owner_id) {
      const owner = await this.usersRepo.findOne(objectDto.owner_id);
      if (!owner) {
        throw new HttpException(
          'Owner not found',
          HttpStatus.NOT_FOUND
        );
      }
      obj.owner = owner;
    }

    return this.objectRepo.save(obj);
  }

  // MARK: - Find All
  async findAll(): Promise<ObjectFile[]> {
    return this.objectRepo.findAll();
  }

  // MARK: - Find One
  async findOne(id: string): Promise<ObjectFile | null> {
    return this.objectRepo.findOne(id);
  }
}
