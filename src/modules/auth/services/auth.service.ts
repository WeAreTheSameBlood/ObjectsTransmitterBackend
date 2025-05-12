import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppWriteAuthService } from '@services';
import { AuthLoginDTO, AuthSingInDTO } from '../entities/dtos';
import { JwtTokenBody } from '../entities/domain/jwt-token-body';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class AuthService {
  // MARK: - Init
  constructor(
    private jwtService: JwtService,
    private authService: AppWriteAuthService,
    private usersService: UsersService
  ) {}

  // MARK: - SingIn
  async singUp(dto: AuthSingInDTO): Promise<{
    userId: string;
    email: string;
  }> {
    try {
      const uniqueUsername = await this.authService.isUsernameUnique(dto.username);
      
      if (uniqueUsername) {
        await this.usersService.create(dto);
        return await this.authService.createUser(dto.email, dto.password, dto.username);
      } else {
        throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
      }
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
      const { userId, sessionId } = await this.authService.createSession(
        dto.email,
        dto.password,
      );
      const payload: JwtTokenBody = {
        subjectId: userId,
        email: dto.email,
        sessionId: sessionId,
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (exception: any) {
      throw new HttpException(exception.message, HttpStatus.UNAUTHORIZED);
    }
  }

  // MARK: - Logout
  async logout(token: string): Promise<{ success: boolean }> {
    const { tokenBody } = this.decodeToken(token);

    try {
      this.authService.deleteSession(tokenBody.sessionId);
      return { success: true };
    } catch (exception: any) {
      throw new HttpException(
        exception.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // MARK: - Regenerate Token
  async regenerateToken(oldToken: string): Promise<{ accessToken: string }> {
    const { tokenBody, expiresIn } = this.decodeToken(oldToken);
    
    if (!expiresIn) {
      throw new HttpException('Token unautorized', HttpStatus.UNAUTHORIZED);
    }

    if (!tokenBody.subjectId || !tokenBody.sessionId) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const newToken = this.jwtService.sign(tokenBody);
    return { accessToken: newToken };
  }

  // MARK: - Private
  private decodeToken(token: string): {
    tokenBody: JwtTokenBody;
    expiresIn: number | null;
  } {
    const decoded = this.jwtService.decode(token) as {
      subjectId: string;
      email: string;
      sessionId: string;
      exp?: number;
    };
    return {
      tokenBody: {
        subjectId: decoded.subjectId,
        email: decoded.email,
        sessionId: decoded.sessionId,
      },
      expiresIn: decoded.exp ?? null,
    };
  }
}