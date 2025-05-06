import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectModel } from './object.model';
import { v4 as uuidv4 } from 'uuid';
import { AppWriteManager } from '../services/appwrite/appwrite-manager.service';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(ObjectModel)
    private objectRepo: Repository<ObjectModel>,
    private appWriteManager: AppWriteManager,
  ) {}

  async createObject(
    file: Express.Multer.File,
    name: string,
  ): Promise<ObjectModel> {
    const fileId = await this.appWriteManager.uploadModelFile(file);
    
    const sizeInMb = file.size / (1024 * 1024);
    const obj = this.objectRepo.create({
      name,
      model_file_url_key: fileId,
      size: sizeInMb,
    });
    return this.objectRepo.save(obj);
  }
}
