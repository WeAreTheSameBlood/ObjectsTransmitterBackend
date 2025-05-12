import {
  Controller, Post, Get,
  UploadedFile, UseInterceptors, Body,
  HttpException, HttpStatus, HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation, ApiOkResponse,
  ApiParam, ApiNotFoundResponse,
  ApiConsumes, ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse, ApiTags,
  ApiExtraModels, ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModelsService } from '../services/models.service';
import { ModelFile } from '../entities/storage/model-file';
import { ModelGeneralInfoDTO, ModelAddDTO } from '../entities/dtos';
import { ModelDetailsInfoDTO } from '../entities/dtos/model-detail-info.dto';
import { UserGeneralInfoDTO } from '@modules/users/entities/dtos';
import { AppWriteStorageService, LoggerService } from '@services';
import { JwtAuthGuard } from '@common/guards/jwt-auth/jwt-auth.guard';

@ApiTags('models')
@ApiBearerAuth('access-tocken')
@ApiExtraModels(ModelGeneralInfoDTO, ModelDetailsInfoDTO)
@Controller({ path: 'models', version: '1' })
export class ModelsController {
  // MARK: - Init
  constructor(
    private readonly modelsService: ModelsService,
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
      const object: ModelFile = await this.modelsService.addNewModel(
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
      const objectFiles = await this.modelsService.findAll();
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
    const model = await this.modelsService.findOneById(id);
    if (!model) {
      throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
    }

    let ownerDto: UserGeneralInfoDTO | undefined;
    if (model.owner) {
      ownerDto = {
        id: model.owner.id,
        username: model.owner.username,
        date_registration: model.owner.dateRegistration.toDateString(),
        added_models_count: model.owner.addedModels?.length ?? 0,
      };
    }

    const downloadUrl = this.storageService.getFileDownloadUrl(
      model.model_file_url_key,
    );

    const result: ModelDetailsInfoDTO = {
      id: model.id,
      name: model.name,
      size: model.size,
      size_type: 'Mb',
      date_created: model.date_created.toDateString(),
      owner: ownerDto,
      download_url: downloadUrl,
    };
    return result;
  }

  // MARK: - GET - Models by User ID
  @Get('by_user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all models for a specific user' })
  @ApiParam({ name: 'userId', description: 'User identifier (UUID)' })
  @ApiOkResponse({
    description: 'Array of general model info for the user',
    type: [ModelGeneralInfoDTO],
  })
  @ApiNotFoundResponse({ description: 'No models found for this user' })
  async getModelsByUserId(
    @Param('userId') userId: string,
  ): Promise<ModelGeneralInfoDTO[]> {
    this.logger.info('getModelsByUserId called', { userId });

    const models = await this.modelsService.findAllByUser(userId);

    const results: ModelGeneralInfoDTO[] = models.map((model) => ({
      id: model.id,
      name: model.name,
      size: model.size,
      size_type: 'Mb',
    }));

    return results;
  }

  // MARK: - POST - Delete Model
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiOperation({ summary: 'Delete model by model id' })
  @ApiOkResponse({
    description: 'Boolean response for operations',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Model with entered Id not found' })
  async deleteModel(
    @Param('id') modelId: string,
  ): Promise<{ success: boolean }> {
    this.logger.info('deleteModel called', { modelId });
    return await this.modelsService.deleteModel(modelId);
  }
}