import {
  Controller, Post, Get, Query,
  UploadedFile, UseInterceptors, Body,
  HttpException, HttpStatus, HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';
import { AppWriteManager } from '@services/appwrite/appwrite-manager.service';
import { ObjectFile } from '@models/storage/object.file';

@Controller({ path: 'models', version: '1' })
// MARK: - Init
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly appWriteManager: AppWriteManager,
  ) {}

  // MARK: - POST
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('model_file'))
  async uploadModel(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    if (!file || !name) {
      throw new HttpException(
        'Missing file or name',
        HttpStatus.BAD_REQUEST
      );
    }
    
    // Create new ObjectFile
    const object: ObjectFile = await this.objectsService.createObject(file, name);

    return { id: object.id };
  }

  // MARK: - GET
  @Get()
  @HttpCode(HttpStatus.OK)
  async getModels(
    @Query('id') id?: string
  ) {
    return id
      ? this.getModelById(id)
      : this.getAllModels();
  }

  // MARK: - Private
  private async getAllModels() {
    const objectFiles = await this.objectsService.findAll();
    return {
      objectFiles: objectFiles.map((file) => ({
        id:   file.id,
        name: file.name,
        size: file.size,
        size_type: "Mb",
      })),
    };
  }

  private async getModelById(id: string) {
    const object = await this.objectsService.findOne(id);
    if (!object) {
      throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    }

    const downloadUrl = this.appWriteManager.getFileDownloadUrl(
      process.env.APPWRITE_BUCKET_ID!,
      object.model_file_url_key,
    );

    return {
      id:   object.id,
      name: object.name,
      size: object.size,
      size_type: "Mb",
      date_created: object.date_created,
      downloadUrl,
    };
  }
}