import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // koli chybe: CORS header ‘Access-Control-Allow-Origin’ missing
  let port: any = process.env.PORT; // pouzivane na heroku
  if (port == null || port == "") {
      port = 8081;
  }
  await app.listen(port);
}
bootstrap();
