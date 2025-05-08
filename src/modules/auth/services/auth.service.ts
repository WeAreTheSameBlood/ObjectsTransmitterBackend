import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService }   from '@nestjs/jwt';
import { Account, Users } from 'node-appwrite';
import { ConfigService }from '@nestjs/config';
import { AuthLoginDTO, AuthSingInDTO }    from '../entities/dtos';

@Injectable()
export class AuthService {
  // Properties
  private account: Account;

  // Init
  constructor(
    private jwtService: JwtService,
    private cfg: ConfigService,
  ) {
    const client = new (require('node-appwrite').Client)()
      .setEndpoint( this.cfg.get<string>('APPWRITE_ENDPOINT')!)
      .setProject(  this.cfg.get<string>('APPWRITE_PROJECT_ID')!)
      .setKey(      this.cfg.get<string>('APPWRITE_API_KEY')!);
    this.account = new Account(client);
  }

  // SingIn
  async singIn(
    dto: AuthSingInDTO
  ): Promise<{ userId: string; email: string }> {
    try {
      const user = await this.account.create(
        'unique()',
        dto.email,
        dto.password,
        dto.username,
      );
      if (dto.redirectUrl) {
        await this.account.createVerification(dto.redirectUrl);
      }
      return { userId: user.$id, email: user.email };
    } catch (e: any) {
      throw new HttpException(e.message, e.code || HttpStatus.BAD_REQUEST);
    }
  }

  // Login
  async login(
    dto: AuthLoginDTO
  ): Promise<({ accessToken: string })> {
    try {
      const session = await this.account.createEmailPasswordSession(
        dto.email,
        dto.password,
      );
      const payload = {
        sub: session.userId,
        email: dto.email,
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (exception: any) {
      throw new HttpException(
        exception.message,
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}