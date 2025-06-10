import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductGateway } from './product.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [ProductService, ProductGateway],
  controllers: [ProductController],
})
export class ProductModule { }
