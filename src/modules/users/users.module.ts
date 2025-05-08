import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/storage/User'
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { GuardsModule } from '@src/common/guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UsersRepository,
    GuardsModule
  ],
  controllers: [UsersController],
  exports: [
    UsersService,
    UsersRepository
  ],
})
export class UsersModule { }
