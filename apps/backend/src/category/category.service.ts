import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryGateway } from './category.gateway';
import { Category } from '@prisma/client';
import { CacheService } from 'src/cache/cache.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    private readonly CACHE_KEY = 'categories:all';

    constructor(
        private readonly prisma: PrismaService,
        private readonly categoryGateway: CategoryGateway,
        private readonly cache: CacheService
    ) { }

    async create(dto: CreateCategoryDto) {
        const category = await this.prisma.category.create({
            data: dto,
        });
        await this.cache.del(this.CACHE_KEY);
        this.categoryGateway.emitNewCategory(category);
        return category;
    }

    async findAll(): Promise<Category[]> {
        const cached = await this.cache.get(this.CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }

        const categories = await this.prisma.category.findMany();
        await this.cache.set(this.CACHE_KEY, JSON.stringify(categories));

        return categories;
    }

    async findById(id: string): Promise<Category> {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Categoria não encontrada');
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const updated = await this.prisma.category.update({
            where: { id },
            data: dto,
        });
        await this.cache.del(this.CACHE_KEY);
        this.categoryGateway.emitNewCategory(updated);
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.delete({ where: { id } });
        await this.cache.del(this.CACHE_KEY);
        this.categoryGateway.emitCategoryDeleted(id);
    }
} 