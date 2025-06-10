import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { seedCategories } from './prisma/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await seedCategories();

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
