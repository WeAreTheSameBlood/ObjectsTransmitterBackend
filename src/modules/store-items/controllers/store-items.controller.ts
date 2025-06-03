import {
  Controller, Post, Get,
  UploadedFile, UseInterceptors, Body,
  HttpException, HttpStatus, HttpCode,
  Param,
  UseGuards,
  UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StoreItemsService } from '../services/models.service';
import { StoreItem } from '../entities/storage/store-item';
import { StoreItemGeneralInfoDTO, StoreItemAddDTO } from '../entities/dtos';
import { StoreItemDetailsInfoDTO } from '../entities/dtos/store-item-detail-info.dto';
import { UserGeneralInfoDTO } from '@modules/users/entities/dtos';
import { AppWriteStorageService, LoggerService } from '@services';
import { JwtAuthGuard } from '@common/guards/jwt-auth/jwt-auth.guard';

@ApiTags('items')
@ApiBearerAuth('access-tocken')
@ApiExtraModels(StoreItemGeneralInfoDTO, StoreItemDetailsInfoDTO)
@Controller({ path: 'items', version: '1' })
export class StoreItemsController {
  // MARK: - Init
  constructor(
    private readonly storeItemsService: StoreItemsService,
    private readonly storageService: AppWriteStorageService,
    private readonly logger: LoggerService,
  ) {}

  // MARK: - POST - New Item
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'model_file', maxCount: 1 },
      { name: 'barcode_image_file', maxCount: 1 },
    ])
  )
  async newStoreItem(
    @UploadedFiles() files: {
      model_file?: Express.Multer.File[];
      barcode_image_file?: Express.Multer.File[]
    },
    @Body() itemDto: StoreItemAddDTO,
  ): Promise<{ item_id: string }> {
    this.logger.info('newStoreItem called', {
      title: itemDto.title,
      brand: itemDto.brand,
      amount: itemDto.amount,
      barcodeValue: itemDto.barcode_value,
    });

    const modelFile = files.model_file?.[0];
    const barcodeImageFile = files.barcode_image_file?.[0];

    if (!modelFile || !barcodeImageFile) {
      this.logger.error('newStoreItem missing required fields or files', {
        modelFileExists: modelFile != null,
        title:    itemDto.title,
        brand:    itemDto.brand,
        amount:   itemDto.amount,
      });
      throw new HttpException('Missing file or required data', HttpStatus.BAD_REQUEST);
    }

    try {
      const storeItem: StoreItem = await this.storeItemsService.addNewItem(
        itemDto,
        modelFile,
        barcodeImageFile,
      );
      this.logger.info('newStoreItem succeeded', { itemId: storeItem.id });
      return { item_id: storeItem.id };
    } catch (error) {
      this.logger.error('newStoreItem failed', error);
      throw error;
    }
  }

  // MARK: - GET - All Models
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get all models' })
  // @ApiOkResponse({
  //   description: 'Array of general model info',
  //   type: [StoreItemGeneralInfoDTO],
  // })
  // async getModels(): Promise<StoreItemGeneralInfoDTO[]> {
  //   try {
  //     this.logger.info('getAllModels called');
  //     const objectFiles = await this.storeItemsService.findAll();
  //     return objectFiles.map((file) => ({
  //       id: file.id,
  //       name: file.title,
  //       size: file.size,
  //       size_type: 'Mb',
  //     }));
  //   } catch (error) {
  //     this.logger.error('getModels failed', error);
  //     throw error;
  //   }
  // }

  // // MARK: - GET - Model By ID
  // @Get(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get model details by ID' })
  // @ApiParam({ name: 'id', description: 'Model identifier (UUID)' })
  // @ApiOkResponse({
  //   description: 'Model details',
  //   type: StoreItemDetailsInfoDTO,
  // })
  // @ApiNotFoundResponse({ description: 'Model not found' })
  // async getModelById(
  //   @Param('id') id: string,
  // ): Promise<StoreItemDetailsInfoDTO> {
  //   this.logger.info('getModel by Id called', { id });
  //   const model = await this.storeItemsService.findOneById(id);
  //   if (!model) {
  //     throw new HttpException('Model not found', HttpStatus.NOT_FOUND);
  //   }

  //   let ownerDto: UserGeneralInfoDTO | undefined;
  //   if (model.owner) {
  //     ownerDto = {
  //       id: model.owner.id,
  //       username: model.owner.username,
  //       date_registration: model.owner.dateRegistration.toDateString(),
  //       added_models_count: model.owner.addedModels?.length ?? 0,
  //     };
  //   }

  //   const downloadUrl = this.storageService.getFileDownloadUrl(
  //     model.model_file_url_key,
  //   );

  //   const result: StoreItemDetailsInfoDTO = {
  //     id: model.id,
  //     name: model.title,
  //     size: model.size,
  //     size_type: 'Mb',
  //     date_created: model.date_created.toDateString(),
  //     owner: ownerDto,
  //     download_url: downloadUrl,
  //   };
  //   return result;
  // }

  // // MARK: - GET - Models by User ID
  // @Get('by_user/:userId')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get all models for a specific user' })
  // @ApiParam({ name: 'userId', description: 'User identifier (UUID)' })
  // @ApiOkResponse({
  //   description: 'Array of general model info for the user',
  //   type: [StoreItemGeneralInfoDTO],
  // })
  // @ApiNotFoundResponse({ description: 'No models found for this user' })
  // async getModelsByUserId(
  //   @Param('userId') userId: string,
  // ): Promise<StoreItemGeneralInfoDTO[]> {
  //   this.logger.info('getModelsByUserId called', { userId });

  //   const models = await this.storeItemsService.findAllByUser(userId);

  //   const results: StoreItemGeneralInfoDTO[] = models.map((model) => ({
  //     id: model.id,
  //     name: model.title,
  //     size: model.size,
  //     size_type: 'Mb',
  //   }));

  //   return results;
  // }

  // // MARK: - POST - Delete Model
  // @Post(':id')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiUnauthorizedResponse({ description: 'Authentication required' })
  // @ApiOperation({ summary: 'Delete model by model id' })
  // @ApiOkResponse({
  //   description: 'Boolean response for operations',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       success: { type: 'boolean', example: true },
  //     },
  //   },
  // })
  // @ApiNotFoundResponse({ description: 'Model with entered Id not found' })
  // async deleteModel(
  //   @Param('id') modelId: string,
  // ): Promise<{ success: boolean }> {
  //   this.logger.info('deleteModel called', { modelId });
  //   return await this.storeItemsService.deleteModel(modelId);
  // }
}