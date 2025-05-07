import {
  Controller,
  Get, Post,
  Param, Body,
  HttpCode, HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserAddDTO, UserGeneralInfoDTO, UserDetailedInfoDTO } from '../entities/dtos';

@Controller('users')
export class UsersController {
  // MARK: - Init
  constructor(private readonly usersService: UsersService) {}

  // MARK: - Create
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() userDto: UserAddDTO
  ): Promise<String> {
    return await this.usersService.create(userDto);
  }

  // MARK: - Find All
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserGeneralInfoDTO[]> {
    const users = await this.usersService.findAll();
    const usersResults: UserGeneralInfoDTO[] = users.map((user) => ({
      id:               user.id,
      username:         user.username,
      dateRegistration: user.dateRegistration.toDateString(),
      addedModelsCount: user.addedModels.length
    }));
    return usersResults;
  }

  // MARK: - Find by Id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string
  ): Promise<UserDetailedInfoDTO> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      );
    }

    const result: UserDetailedInfoDTO = {
      id:                   user.id,
      username:             user.username,
      name:                 user.name ?? '',
      dateRegistration:     user.dateRegistration,
      addedModelsCount:     user.addedModels.length,
      favoriteModelsCount:  user.favoriteModels.length
    };
    return result;
  }
}
