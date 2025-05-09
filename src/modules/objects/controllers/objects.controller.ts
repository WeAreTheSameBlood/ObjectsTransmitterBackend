import {
  Controller, Post, Get, Query,
  UploadedFile, UseInterceptors, Body,
  HttpException, HttpStatus, HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from '../services/objects.service';
import { ObjectFile } from '../entities/storage/ObjectFile';
import { ObjectGeneralInfoDTO, ObjectsAddDTO } from '../entities/dtos';
import { ObjectDetailsInfoDTO } from '../entities/dtos/object-detail-info.dto';
import { UserGeneralInfoDTO } from '@src/modules/users/entities/dtos';
import { AppWriteStorageService } from '@src/common/services/appwrite';
import { LoggerService } from '@common/services/logger/service/logger-service';

@Controller({ path: 'models', version: '1' })
export class ObjectsController {
  // MARK: - Init
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly storageService: AppWriteStorageService,
    private readonly logger: LoggerService,
  ) {}

  // MARK: - POST
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('model_file'))
  async uploadModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() objectDto: ObjectsAddDTO,
  ): Promise<{ id: string }> {
    this.logger.info('uploadModel called', { name: objectDto.name, fileName: file?.originalname });
    
    if (!file || !objectDto.name) {
      this.logger.error('uploadModel missing file or name', {
        fileExist: file != null,
        name: objectDto.name
      });
      throw new HttpException(
        'Missing file or name',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const object: ObjectFile = await this.objectsService.createObject(file, objectDto);
      this.logger.info('uploadModel succeeded', { objectId: object.id });
      return { id: object.id };
    } catch (error) {
      this.logger.error('uploadModel failed', error);
      throw error;
    }
  }

  // MARK: - GET
  @Get()
  @HttpCode(HttpStatus.OK)
  async getModels(
    @Query('id') id?: string
  ): Promise<any> {
    try {
      return id
        ? this.getModelById(id)
        : this.getAllModels();
    } catch (error) {
      this.logger.error('getModels failed', error);
      throw error;
    }
  }

  // MARK: - Private
  private async getAllModels(
  ): Promise<ObjectGeneralInfoDTO[]> {
    this.logger.info('getAllModels called');
    const objectFiles = await this.objectsService.findAll();
    return objectFiles.map((file) => ({
        id:         file.id,
        name:       file.name,
        size:       file.size,
        size_type:  "Mb",
      }))
  }

  private async getModelById(
    id: string
  ): Promise<ObjectDetailsInfoDTO> {
    this.logger.info('getModels called', { id });
    const object = await this.objectsService.findOne(id);
    if (!object) {
      throw new HttpException(
        'Model not found',
        HttpStatus.NOT_FOUND
      );
    }

    let ownerDto: UserGeneralInfoDTO | undefined;
    if (object.owner) {
      ownerDto = {
        id:               object.owner.id,
        username:         object.owner.username,
        dateRegistration: object.owner.dateRegistration.toDateString(),
        addedModelsCount: object.owner.addedModels?.length ?? 0,
      };
     }

    const downloadUrl = this.storageService.getFileDownloadUrl(
      process.env.APPWRITE_BUCKET_ID!,
      object.model_file_url_key,
    );

    const result: ObjectDetailsInfoDTO = {
      id:           object.id,
      name:         object.name,
      size:         object.size,
      size_type:    'Mb',
      date_created: object.date_created.toDateString(),
      owner:        ownerDto,
      download_url: downloadUrl,
    };
    return result;
  }
}