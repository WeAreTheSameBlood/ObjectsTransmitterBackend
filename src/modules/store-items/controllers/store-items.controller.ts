import {
  Controller, Post, Get,
  UseInterceptors, Body,
  HttpException, HttpStatus, HttpCode,
  Param, UploadedFiles,
} from '@nestjs/common';
import {
  ApiOperation, ApiOkResponse,
  ApiParam, ApiNotFoundResponse,
  ApiConsumes, ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse, ApiTags,
  ApiExtraModels,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StoreItemsService } from '../services/models.service';
import { StoreItem } from '../entities/storage/store-item';
import { StoreItemGeneralInfoDTO, StoreItemAddDTO } from '../entities/dtos';
import { StoreItemDetailsInfoDTO } from '../entities/dtos/store-item-detail-info.dto';
import { AppWriteStorageService, LoggerService } from '@services';

@ApiTags('items')
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
  @ApiOperation({ summary: 'Create a new store item with model file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Bean Can x Tomato Sauce' },
        price: { type: 'string', example: '3.14' },
        categories: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['Console', 'Headphones', 'Tools', 'Other'],
          },
          example: ['Controller', 'Other'],
        },
        model_file: { type: 'file', format: 'binary' },
        title_image: { type: 'file', format: 'binary' },
        additional_images: {
          type: 'array',
          items: { type: 'file', format: 'binary' },
          maxItems: 6,
        },
      },
      required: ['title', 'price', 'categories', 'model_file', 'title_image'],
    },
  })
  @ApiCreatedResponse({
    description: 'Store item created successfully',
    schema: {
      type: 'object',
      properties: {
        item_id: {
          type: 'string',
          example: 'e30bc846-60dc-4499-9e72-2ab6035',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Missing file or required data' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'model_file', maxCount: 1 },
      { name: 'title_image', maxCount: 1 },
      { name: 'additional_images', maxCount: 6 },
    ]),
  )
  async newStoreItem(
    @UploadedFiles()
    files: {
      model_file?: Express.Multer.File[];
      title_image?: Express.Multer.File[];
      additional_images?: Express.Multer.File[];
    },
    @Body() itemDto: StoreItemAddDTO,
  ): Promise<{ item_id: string }> {
    this.logger.info('newStoreItem called', {
      title: itemDto.title,
      price: itemDto.price,
      categories: itemDto.categories,
      additionalImages: files.additional_images?.length,
    });

    const modelFile = files.model_file?.[0];
    const titleImage = files.title_image?.[0];
    const additionalImages = files.additional_images || [];

    if (!modelFile || !titleImage) {
      this.logger.error('newStoreItem missing required fields or files', {
        modelFileExists: modelFile != null,
        titleImageExists: titleImage != null,
        title: itemDto.title,
        price: itemDto.price,
      });
      throw new HttpException(
        'Missing file or required data',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const storeItem: StoreItem = await this.storeItemsService.addNewItem(
        itemDto,
        modelFile,
        titleImage,
        additionalImages,
      );
      this.logger.info('newStoreItem succeeded', { itemId: storeItem.id });
      return { item_id: storeItem.id };
    } catch (error) {
      this.logger.error('newStoreItem failed', error);
      throw error;
    }
  }

  // MARK: - GET - All Items
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a list of all store items' })
  @ApiOkResponse({
    description: 'Array of store items',
    type: StoreItemGeneralInfoDTO,
    isArray: true,
  })
  async getStoreItems(): Promise<StoreItemGeneralInfoDTO[]> {
    try {
      this.logger.info('getStoreItems called');

      const storeItems = await this.storeItemsService.findAll();
      return storeItems.map((item) => ({
        id: item.id,
        title: item.title,
        title_image_download_url: this.storageService.getFileDownloadUrl(
          item.titleImageUrlKey,
        ),
        price: item.price,
        categories: item.categories,
      }));
    } catch (error) {
      this.logger.error('getStoreItems failed', error);
      throw error;
    }
  }

  // MARK: - GET - Item By ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single store item by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the store item' })
  @ApiOkResponse({
    description: 'Store item details',
    type: StoreItemDetailsInfoDTO,
  })
  @ApiNotFoundResponse({ description: 'Store item not found' })
  async getStoreItemById(
    @Param('id') id: string,
  ): Promise<StoreItemDetailsInfoDTO> {
    this.logger.info('getStoreItemById by Id called', { id });

    const storeItem = await this.storeItemsService.findOneById(id);
    if (!storeItem) {
      throw new HttpException('Store Item not found', HttpStatus.NOT_FOUND);
    }

    const modelFileUrlKey = this.storageService.getFileDownloadUrl(
      storeItem.modelFileUrlKey,
    );
    const titleImageUrlKey = this.storageService.getFileDownloadUrl(
      storeItem.titleImageUrlKey,
    );

    const result: StoreItemDetailsInfoDTO = {
      id: storeItem.id,
      title: storeItem.title,
      model_file_download_url: modelFileUrlKey,
      title_image_download_url: titleImageUrlKey,
      price: storeItem.price,
      date_created: storeItem.dateCreated.toDateString(),
      categories: storeItem.categories,
      media_files_url_keys: storeItem.media.map((img) =>
        this.storageService.getFileDownloadUrl(img.media_file_url_key),
      ),
    };
    return result;
  }

  // MARK: - POST - Delete Item
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a store item by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the store item to delete' })
  @ApiOkResponse({
    description: 'Deletion result',
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean', example: true } },
    },
  })
  @ApiNotFoundResponse({ description: 'Store item with entered id not found' })
  async deleteStoreItem(
    @Param('id') itemId: string,
  ): Promise<{ success: boolean }> {
    this.logger.info('deleteStoreItem called', { itemId });
    return await this.storeItemsService.deleteModel(itemId);
  }
}