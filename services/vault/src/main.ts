import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable?.("x-powered-by");
  app.use((_req: any, res: any, next: any) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [
      "http://localhost:3000",
      "https://hips.foundation",
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
