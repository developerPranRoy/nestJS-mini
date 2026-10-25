import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = Number(process.env.PORT|| 5000);
  const NODE_ENV = process.env.NODE_ENV ?? 'development';

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(PORT, '0.0.0.0');

  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
}

bootstrap();
