import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryGateway } from './gateway/category.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
    imports: [PrismaModule, CacheModule],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryGateway],
})
export class CategoryModule { } 