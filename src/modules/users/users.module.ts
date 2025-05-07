import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/storage/User'
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UsersRepository
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
