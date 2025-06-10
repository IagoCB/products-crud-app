import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ProductModule } from './product/product.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [ProductModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, CacheService],
  exports: [PrismaService, CacheService],
})
export class AppModule { }
