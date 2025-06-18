import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add cookie parser middleware
  app.use(cookieParser());

  // Enables validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Remove properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if extra properties sent
    transform: true,           // Transform payloads to DTO instances
  }));

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Backend is running on ' + process.env.BACKEND_URL);
}
bootstrap();
