import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  // 全局 DTO 验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }))

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局日志拦截器
  app.useGlobalInterceptors(new LoggingInterceptor())

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  })

  const port = process.env.API_PORT ?? 3000
  await app.listen(port)
  console.log(`🚀 API 服务已启动：http://localhost:${port}`)
}

bootstrap()
