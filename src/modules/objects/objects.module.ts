import { Module } from '@nestjs/common';
import { ObjectsController } from './controllers/objects.controller';
import { ObjectsService } from './services/objects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectFile } from '@src/modules/objects/entities/storage/ObjectFile';
import { ObjectsRepository } from './repositories/objects.repository';
import { UsersModule } from '@modules/users/users.module';
import { AppWriteModule } from '@src/common/services/appwrite/appwrite.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectFile]),
    UsersModule,
    AppWriteModule
  ],
  controllers: [ObjectsController],
  providers: [
    ObjectsRepository,
    ObjectsService,
  ],
})
export class ObjectsModule { }
