import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Session Engine listens on internal port 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`H.I.P.S. Session Engine running on port ${port}`);
}
bootstrap();
