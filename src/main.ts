import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'module-alias/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // ✅ 启用 CORS
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
