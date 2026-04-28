import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Vault Service strictly listens on internal port
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`H.I.P.S. Identity Vault Service running on port ${port}`);
}
bootstrap();
