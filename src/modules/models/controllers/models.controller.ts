import {
  Controller, Post, Get, Query,
  UploadedFile, UseInterceptors, Body,
  HttpException, HttpStatus, HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModelsService } from '../services/models.service';
import { ModelFile } from '../entities/storage/model-file';
import { ModelGeneralInfoDTO, ModelAddDTO } from '../entities/dtos';
import { ModelDetailsInfoDTO } from '../entities/dtos/model-detail-info.dto';
import { UserGeneralInfoDTO } from '@src/modules/users/entities/dtos';
import { AppWriteStorageService, LoggerService } from '@services';

@ApiTags('models')
@ApiBearerAuth('access-tocken')
@ApiExtraModels(ModelGeneralInfoDTO, ModelDetailsInfoDTO)
@Controller({ path: 'models', version: '1' })
export class ModelsController {
  // MARK: - Init
  constructor(
    private readonly objectsService: ModelsService,
    private readonly storageService: AppWriteStorageService,
    private readonly logger: LoggerService,
  ) {}

  // MARK: - POST - Upload
  @ApiOperation({ summary: 'Upload a new model file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Model file and metadata',
    schema: {
      type: 'object',
      properties: {
        model_file: {
          format: 'binary',
          description: 'Binary 3D model file',
        },
        name: {
          type: 'string',
          description: 'Name for the model',
          example: 'My_New_Model',
        },
      },
      required: ['model_file', 'name'],
    },
  })
  @ApiCreatedResponse({
    description: 'Model successfully uploaded',
    schema: {
      type: 'object',
      properties: {
        model_id: { type: 'string', description: 'UUID of the added model' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Missing file or name' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('model_file'))
  async uploadModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() objectDto: ModelAddDTO,
  ): Promise<{ model_id: string }> {
    this.logger.info('uploadModel called', {
      name: objectDto.name,
      fileName: file?.originalname,
    });

    if (!file || !objectDto.name) {
      this.logger.error('uploadModel missing file or name', {
        fileExist: file != null,
        name: objectDto.name,
      });
      throw new HttpException('Missing file or name', HttpStatus.BAD_REQUEST);
    }
    try {
      const object: ModelFile = await this.objectsService.addNewModel(
        file,
        objectDto,
      );
      this.logger.info('uploadModel succeeded', { objectId: object.id });
      return { model_id: object.id };
    } catch (error) {
      this.logger.error('uploadModel failed', error);
      throw error;
    }
  }

  // MARK: - GET - All Models
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all models' })
  @ApiOkResponse({
    description: 'Array of general model info',
    type: [ModelGeneralInfoDTO],
  })
  async getModels(): Promise<ModelGeneralInfoDTO[]> {
    try {
      this.logger.info('getAllModels called');
      const objectFiles = await this.objectsService.findAll();
      return objectFiles.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        size_type: 'Mb',
      }));
    } catch (error) {
      this.logger.error('getModels failed', error);
      throw error;
    }
  }

  // MARK: - GET - Model By ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get model details by ID' })
  @ApiParam({ name: 'id', description: 'Model identifier (UUID)' })
  @ApiOkResponse({
    description: 'Model details',
    type: ModelDetailsInfoDTO,
  })
  @ApiNotFoundResponse({ description: 'Model not found' })
  async getModelById(@Param('id') id: string): Promise<ModelDetailsInfoDTO> {
    this.logger.info('getModel by Id called', { id });
    const object = await this.objectsService.findOne(id);
    if (!object) {
      throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    }

    let ownerDto: UserGeneralInfoDTO | undefined;
    if (object.owner) {
      ownerDto = {
        id: object.owner.id,
        username: object.owner.username,
        date_registration: object.owner.dateRegistration.toDateString(),
        added_models_count: object.owner.addedModels?.length ?? 0,
      };
    }

    const downloadUrl = this.storageService.getFileDownloadUrl(
      object.model_file_url_key,
    );

    const result: ModelDetailsInfoDTO = {
      id: object.id,
      name: object.name,
      size: object.size,
      size_type: 'Mb',
      date_created: object.date_created.toDateString(),
      owner: ownerDto,
      download_url: downloadUrl,
    };
    return result;
  }
}