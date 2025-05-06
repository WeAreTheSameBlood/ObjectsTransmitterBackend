import {
  Controller, Post,
  UploadedFile, UseInterceptors,
  Body, HttpException, HttpStatus, HttpCode,
  Get
} from '@nestjs/common';
import { Param } from '@nestjs/common';
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

    // Get uri file on Bucket
    const downloadUrl: string = this.appWriteManager.getFileDownloadUrl(
      process.env.APPWRITE_BUCKET_ID!,
      object.model_file_url_key,
    );

    return {
      id: object.id,
      downloadUrl,
    };
  }

  // MARK: - GET All Models
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllModels() {
    const objectFiles = await this.objectsService.findAll();
    return { objectFiles };
  }

  // MARK: - GET by ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getModelById(@Param('id') id: string) {
    const object = await this.objectsService.findOne(id);
    if (!object) {
      throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    }
    const downloadUrl = this.appWriteManager.getFileDownloadUrl(
      process.env.APPWRITE_BUCKET_ID!,
      object.model_file_url_key,
    );
    return {
      id: object.id,
      name: object.name,
      size: object.size,
      date_created: object.date_created,
      downloadUrl,
    };
  }
}
