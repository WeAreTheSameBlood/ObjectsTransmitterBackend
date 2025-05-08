import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppWriteAuthService } from '@services/appwrite';
import { AuthLoginDTO, AuthSingInDTO } from '../entities/dtos';

@Injectable()
export class AuthService {
  // MARK: - Init
  constructor(
    private jwtService: JwtService,
    private authService: AppWriteAuthService,
  ) { }

  // MARK: - SingIn
  async singIn(dto: AuthSingInDTO): Promise<{
    userId: string;
    email: string;
  }> {
    try {
      return this.authService.createUser(dto.email, dto.password, dto.username);
    } catch (exception: any) {
      throw new HttpException(
        exception.message,
        exception.code || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // MARK: - Login
  async login(dto: AuthLoginDTO): Promise<{ accessToken: string }> {
    try {
      const { userId } = await this.authService.createSession(
        dto.email,
        dto.password,
      );
      const payload = {
        sub: userId,
        email: dto.email,
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (exception: any) {
      throw new HttpException(exception.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // MARK: - Logout
  async logout(
    sessionId: string
  ): Promise<{ success: boolean }> {
    try {
      this.authService.deleteSession(sessionId);
      return {success: true};
    } catch (exception: any) {
      throw new HttpException(exception.message, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }
}