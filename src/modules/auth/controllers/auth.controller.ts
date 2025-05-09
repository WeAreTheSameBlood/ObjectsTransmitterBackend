import {
  Controller, Body,
  Post,
  HttpCode, HttpStatus,
  Req, UseGuards, Request
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthSingInDTO, AuthLoginDTO } from '../entities/dtos';
import { JwtAuthGuard } from '@common/guards/jwt-auth/jwt-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  // MARK: - Init
  constructor(private authService: AuthService) {}

  // MARK: - SignIn
  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async singIn(
    @Body() dto: AuthSingInDTO,
  ): Promise<{ userId: string; email: string }> {
    return this.authService.singIn(dto);
  }

  // MARK: - Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDTO) {
    return this.authService.login(dto);
  }

  // MARK: - Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Body('sessionId') sessionId: string) {
    return this.authService.logout(sessionId);
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