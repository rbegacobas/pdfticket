import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //await app.listen(3000);
  // Heroku proporciona el puerto en la variable de entorno PORT
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
