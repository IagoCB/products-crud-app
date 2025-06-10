import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheService } from './cache/cache.service';
import { CacheModule } from './cache/cache.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule, PrismaModule, CacheModule, CategoryModule],
  controllers: [],
  providers: [CacheService],
})
export class AppModule { }
