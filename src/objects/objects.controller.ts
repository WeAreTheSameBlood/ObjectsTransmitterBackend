import { Controller, Post, UploadedFile,
  UseInterceptors, Body,
  HttpException, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';
import { AppWriteManager } from '@services/appwrite/appwrite-manager.service';
import { ObjectModel } from '@models/storage/object.model';

@Controller({ path: 'model', version: '1' })
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly appWriteManager: AppWriteManager,
  ) {}

  @Post()
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

    const object: ObjectModel = await this.objectsService.createObject(file, name);
    const downloadUrl: string = this.appWriteManager.getFileDownloadUrl(
      process.env.APPWRITE_BUCKET_ID!,
      object.model_file_url_key,
    );

    return {
      status: 'created',
      id: object.id,
      downloadUrl,
    };
  }
}
