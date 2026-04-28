import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Safety Service listens on internal port 3003
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`H.I.P.S. Safety Engine running on port ${port}`);
}
bootstrap();
