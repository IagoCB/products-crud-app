import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './product.controller';
import { ProductGateway } from './gateway/product.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [ProductService, ProductGateway],
  controllers: [ProductController],
})
export class ProductModule { }
