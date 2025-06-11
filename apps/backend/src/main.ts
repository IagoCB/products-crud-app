import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { seedCategories } from './prisma/seed';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { RedisExceptionFilter } from './exceptions/redis-exception.filter';
import { PostgresExceptionFilter } from './exceptions/postgres-exception.filter';
import { createTrpcExpressApp } from './trpc';
import { ProductService } from './product/service/product.service';
import { CategoryService } from './category/service/category.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
    preflightContinue: true,
    optionsSuccessStatus: 204,
  });

  await seedCategories();

  const productService = app.get(ProductService);
  const categoryService = app.get(CategoryService);

  const trpcApp = createTrpcExpressApp(productService, categoryService);
  app.use(trpcApp);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new RedisExceptionFilter(),
    new PostgresExceptionFilter()
  );

  const config = new DocumentBuilder()
    .setTitle('API de Produtos')
    .setDescription('API para gerenciamento de produtos')
    .setVersion('1.0')
    .addTag('produtos')
    .addTag('categorias')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
