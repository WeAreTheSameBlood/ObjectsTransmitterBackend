import { Module } from '@nestjs/common';
import { ModelsController } from './controllers/models.controller';
import { ModelsService } from './services/models.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelFile } from '@src/modules/models/entities/storage/model-file';
import { ModelsRepository } from './repositories/models.repository';
import { UsersModule } from '@modules/users/users.module';
import { AppWriteModule } from '@services/appwrite/appwrite.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModelFile]),
    UsersModule,
    AppWriteModule
  ],
  controllers: [ModelsController],
  providers: [
    ModelsRepository,
    ModelsService,
  ],
})
export class ModelsModule { }
