import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryGateway } from './category.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
    imports: [PrismaModule, CacheModule],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryGateway],
})
export class CategoryModule { } 