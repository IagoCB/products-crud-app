import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { seedCategories } from './prisma/seed';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { createTrpcExpressApp } from './trpc';
import { ProductService } from './product/product.service';
import { CategoryService } from './category/category.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });

  // Habilitar CORS para permitir requisições do frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Ou a URL do seu frontend em produção
    credentials: true,
  });

  await seedCategories();

  // Obter instâncias dos serviços do contêiner de injeção de dependência do NestJS
  const productService = app.get(ProductService);
  const categoryService = app.get(CategoryService);

  const trpcApp = createTrpcExpressApp(productService, categoryService);
  app.use(trpcApp);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

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
