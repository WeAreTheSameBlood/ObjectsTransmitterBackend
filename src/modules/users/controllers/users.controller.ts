import {
  Controller,
  Get, Post,
  Param, Body,
  HttpCode, HttpStatus,
  HttpException,
  UseGuards
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserAddDTO, UserGeneralInfoDTO, UserDetailedInfoDTO } from '../entities/dtos';
import { JwtAuthGuard } from '@common/guards/jwt-auth/jwt-auth.guard';
import {
  ApiTags, ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse, ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  // MARK: - Init
  constructor(private readonly usersService: UsersService) {}

  // MARK: - Find All
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: [UserGeneralInfoDTO] })
  async findAll(): Promise<UserGeneralInfoDTO[]> {
    const users = await this.usersService.findAll();
    const usersResults: UserGeneralInfoDTO[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      date_registration: user.dateRegistration.toDateString(),
      added_models_count: user.addedModels.length,
    }));
    return usersResults;
  }

  // MARK: - Find by Id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get detailed user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiOkResponse({ description: 'User details', type: UserDetailedInfoDTO })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserDetailedInfoDTO> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const result: UserDetailedInfoDTO = {
      id: user.id,
      username: user.username,
      name: user.name ?? '',
      date_registration: user.dateRegistration,
      added_models_count: user.addedModels.length,
      favorite_models_count: user.favoriteModels.length,
    };
    return result;
  }
}
