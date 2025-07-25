import 'dotenv/config';
import { randomUUID, randomBytes } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  Object.assign(globalThis, {
    crypto: {
      randomUUID,
      getRandomValues: (buf: Uint8Array) => buf.set(randomBytes(buf.length)),
    },
  });
}

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('Objects Transmitter API')
    .setDescription('REST API Doc')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
