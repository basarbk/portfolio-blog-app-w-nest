import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GenericExceptionFilter } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) =>
        new BadRequestException('Invalid request', { cause: errors }),
    }),
  );
  app.useGlobalFilters(new GenericExceptionFilter());
  await app.listen(8080);
}
bootstrap();
