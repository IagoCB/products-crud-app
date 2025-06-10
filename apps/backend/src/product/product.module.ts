import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductGateway } from './product.gateway';

@Module({
  imports: [PrismaService],
  providers: [ProductService, ProductGateway],
  controllers: [ProductController]
})
export class ProductModule { }
