
import dotenv = require('dotenv');
dotenv.config();
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { LogsService } from './logs/logs.service';
import { JwtObject } from './shared/token/jwt-object.interface';
import { AllExceptionFilter } from './utils/all-exception.filter';

declare module 'express' {
  export interface Request {
    user?: JwtObject;
    logService?: LogsService;
  }
}

Sentry.init({ dsn: process.env.SENTRY_DSN });
Sentry.captureEvent({ level: Sentry.Severity.Info, message: 'Sentry initialized in main.ts' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(Sentry.Handlers.requestHandler());
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3000);
}

bootstrap();
