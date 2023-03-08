import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {XExceptionFilter} from "@michalrakus/x-nest-server-lib/x-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // koli chybe: CORS header ‘Access-Control-Allow-Origin’ missing
  app.useGlobalFilters(new XExceptionFilter());
  let port: any = process.env.PORT; // pouzivane na heroku
  if (port == null || port == "") {
      port = process.env.X_PORT;
  }
  await app.listen(port);
}
bootstrap();
