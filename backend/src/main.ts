import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as cookieParser from 'cookie-parser';
import { logger } from './auth/logger.middleware';

const path = '/Users/tanlipwei/Desktop/firebaseKey.json';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert(path),
    databaseURL: 'https://auth-server.firebaseio.com',
  });

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: true });
  app.use(logger);
  await app.listen(5000);
}
bootstrap();
