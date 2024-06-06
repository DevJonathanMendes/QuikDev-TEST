import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppPipeTransform } from './app.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new AppPipeTransform());
  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());
  app.use(compression());

  await app.listen(process.env.APP_PORT);
}
bootstrap();
