import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AppWriteModule } from '@common/services/appwrite/appwrite.module';
import { GuardsModule } from '@common/guards/guards.module';
import { StrategiesModule } from '@src/common/strategies/jstrategies.module';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    AppWriteModule,
    GuardsModule,
    StrategiesModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN')
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    UsersService
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
