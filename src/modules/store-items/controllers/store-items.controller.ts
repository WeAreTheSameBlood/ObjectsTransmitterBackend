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

  // MARK: - GET - All Items
  @Get()
  @HttpCode(HttpStatus.OK)
  async getStoreItems(): Promise<StoreItemGeneralInfoDTO[]> {
    try {
      this.logger.info('getStoreItems called');

      const storeItems = await this.storeItemsService.findAll();
      return storeItems.map((item) => ({
        id:     item.id,
        title:  item.title,
        brand:  item.brand,
        amount: item.amount
      }));
    } catch (error) {
      this.logger.error('getStoreItems failed', error);
      throw error;
    }
  }

  // MARK: - GET - Model By ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getStoreItemById(
    @Param('id') id: string,
  ): Promise<StoreItemDetailsInfoDTO> {
    this.logger.info('getStoreItemById by Id called', { id });

    const storeItem = await this.storeItemsService.findOneById(id);
    if (!storeItem) {
      throw new HttpException('Store Item not found', HttpStatus.NOT_FOUND);
    }

    const barcodeFileUrlKey = this.storageService.getFileDownloadUrl(
      storeItem.barcodeFileUrlKey,
    );

    const modelFileUrlKey = this.storageService.getFileDownloadUrl(
      storeItem.modelFileUrlKey,
    );

    const result: StoreItemDetailsInfoDTO = {
      id:                       storeItem.id,
      title:                    storeItem.title,
      brand:                    storeItem.brand,
      barcode_value:            storeItem.barcodeValue,
      barcode_download_url:     barcodeFileUrlKey,
      model_file_download_url:  modelFileUrlKey,
      amount:                   storeItem.amount,
      date_created:             storeItem.dateCreated.toDateString(),
      media_files_url_keys:     []
    };
    return result;
  }

  // MARK: - POST - Delete Model
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Model with entered Id not found' })
  async deleteStoreItem(
    @Param('id') itemId: string,
  ): Promise<{ success: boolean }> {
    this.logger.info('deleteStoreItem called', { itemId });
    return await this.storeItemsService.deleteModel(itemId);
  }
}