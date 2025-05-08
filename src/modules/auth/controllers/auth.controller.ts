import {
  Controller, Body,
  Post,
  HttpCode, HttpStatus,
  Req, UseGuards, Request
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthSingInDTO, AuthLoginDTO } from '../entities/dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  // MARK: - Init
  constructor(private auth: AuthService) {}

  // MARK: - SignIn
  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  async singIn(
    @Body() dto: AuthSingInDTO,
  ): Promise<({ userId: string, email: string })> {
    return this.auth.singIn(dto);
  }

  // MARK: - Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDTO) {
    return this.auth.login(dto);
  }

  // MARK: - Test
  @UseGuards(JwtAuthGuard)
  @Post('test-protected')
  @HttpCode(HttpStatus.OK)
  async test(@Request() request) {
    return {
      message: 'You are authenticated',
      user: request.user,
    };
  }
}