import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectFile } from '@modules/objects/entities/storage/ObjectFile';
import { AppWriteManager } from '@services/appwrite/AppWriteManager';

@Injectable()
export class ObjectsService {
  // MARK: - Init
  constructor(
    @InjectRepository(ObjectFile)
    private objectRepo: Repository<ObjectFile>,
    private appWriteManager: AppWriteManager,
  ) {}

  // MARK: - Create
  async createObject(
    file: Express.Multer.File,
    name: string
  ): Promise<ObjectFile> {
    const fileId = await this.appWriteManager.uploadModelFile(file);
    const sizeInMb = file.size / (1024 * 1024);     // byte --> kb --> Mb
    const obj = this.objectRepo.create({
      name,
      model_file_url_key: fileId,
      size: sizeInMb,
    });
    return this.objectRepo.save(obj);
  }

  // MARK: - Find All
  async findAll(): Promise<ObjectFile[]> {
    return this.objectRepo.find();
  }

  // MARK: - Find One
  async findOne(id: string): Promise<ObjectFile | null> {
    return this.objectRepo.findOne({ where: { id } });
  }
}
