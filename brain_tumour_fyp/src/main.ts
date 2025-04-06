import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: configService.get('FRONTEND_URL') ?? 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type, Accept', 'Authorization']
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const PORT: number = configService.get('PORT') || 5000;

  await app.listen(PORT, () => {
    logger.log(`Server started on port ${PORT}`)
  });

}
bootstrap();
