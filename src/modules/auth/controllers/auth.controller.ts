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

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  // MARK: - Init
  constructor(private authService: AuthService) {}

  // MARK: - SignIn
  @Post('sign_up')
  @HttpCode(HttpStatus.CREATED)
  async singUp(
    @Body() dto: AuthSingInDTO,
  ): Promise<{ userId: string; email: string }> {
    return this.authService.singUp(dto);
  }

  // MARK: - Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AuthLoginDTO
  ): Promise<{ accessToken: string }> {
    return this.authService.login(dto);
  }

  // MARK: - Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(
    @Body('sessionId') sessionId: string
  ) {
    return this.authService.logout(sessionId);
  }

  @Get('regenerate_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
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
  async test(@Request() request) {
    return {
      message: 'You are authenticated',
      user: request.user,
    };
  }
}