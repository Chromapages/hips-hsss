import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { IpAllowlistMiddleware } from './auth/ip-allowlist.middleware.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - only allow internal services and web app in development
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Bind IP Allowlist Middleware globally — this applies to ALL routes
  // IpAllowlistMiddleware logs a warning in development if no allowlist is configured,
  // and refuses to serve in production if VAULT_IP_ALLOWLIST is not set.
  const ipMiddleware = app.get(IpAllowlistMiddleware);
  app.use(ipMiddleware);

  // Vault Service strictly listens on internal port
  const port = process.env.PORT || 3002;

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'vault' });
  });

  await app.listen(port);
  console.log(`H.I.P.S. Identity Vault Service running on port ${port}`);

  if (process.send) {
    process.send('ready');
  }
}
bootstrap();