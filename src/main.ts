import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("PORT: ", Configuration().port);
  await app.listen(Configuration().port || 8080);
}
bootstrap();
