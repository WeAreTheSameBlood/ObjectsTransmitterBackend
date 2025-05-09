import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt/jwt.strategy";

@Module({
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class StrategiesModule {}