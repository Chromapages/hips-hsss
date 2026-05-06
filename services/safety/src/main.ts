import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
      'https://app.hips.foundation',
    ],
    credentials: true,
  })

  app.setGlobalPrefix('safety')

  const port = process.env.PORT ?? 3002
  await app.listen(port)
  console.log(`Safety Engine running on port ${port}`)
}

bootstrap()