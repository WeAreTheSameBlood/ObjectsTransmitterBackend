import {
  Controller, Body,
  Post,
  HttpCode, HttpStatus,
  Req, UseGuards, Request,
  Get,
  Headers,
  HttpException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthSingInDTO, AuthLoginDTO } from '../entities/dtos';
import { JwtAuthGuard } from '@common/guards/jwt-auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  // MARK: - Init
  constructor(private authService: AuthService) {}

  // MARK: - Sign Up
  @Post('sign_up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user and create session' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: { example: { userId: 'uuid', email: 'user@example.com' } }
  })
  async singUp(
    @Body() dto: AuthSingInDTO,
  ): Promise<{ userId: string; email: string }> {
    return this.authService.singUp(dto);
  }

  // MARK: - Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT access token' })
  @ApiOkResponse({
    description: 'Login successful',
    schema: { example: { accessToken: '<some-jwt-token>' } }
  })
  async login(
    @Body() dto: AuthLoginDTO
  ): Promise<{ accessToken: string }> {
    return this.authService.login(dto);
  }

  // MARK: - Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate current session' })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: { example: { success: true } }
  })
  logout(
    @Body('sessionId') sessionId: string
  ) {
    return this.authService.logout(sessionId);
  }

  // MARK: - Regenerate Token
  @Get('regenerate_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', description: 'Bearer access token' })
  @ApiOperation({ summary: 'Regenerate a new access token using existing token' })
  @ApiCreatedResponse({
    description: 'Token regenerated',
    schema: { example: { accessToken: 'new-jwt-token' } }
  })
  async regenerateToken(
    @Headers('authorization') authHeader: string,
  ): Promise<{ accessToken: string }> {
    try {
      const token = authHeader?.split(' ')[1];
      return this.authService.regenerateToken(token);
    } catch {
      throw new HttpException('Invalid token in header', HttpStatus.BAD_REQUEST);
    }
  }

  // MARK: - Test
  @Post('test-protected')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test endpoint to verify authentication' })
  @ApiOkResponse({
    description: 'Authenticated user data',
    schema: {
      example: {
        message: 'You are authenticated',
        user: { sub: 'userId', email: 'user@example.com' }
      }
    }
  })
  async test(@Request() request) {
    return {
      message: 'You are authenticated',
      user: request.user,
    };
  }
}