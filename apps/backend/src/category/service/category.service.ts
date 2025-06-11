import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryGateway } from '../gateway/category.gateway';
import { Category } from '@prisma/client';
import { CacheService } from '../../cache/service/cache.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
    private readonly CACHE_KEY = 'categories:all';

    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
        private readonly categoryGateway: CategoryGateway,
    ) { }

    private convertDates(category: any): Category {
        return {
            ...category,
            createdAt: new Date(category.createdAt),
        };
    }

    private convertDatesArray(categories: any[]): Category[] {
        return categories.map(category => this.convertDates(category));
    }

    async findAll(): Promise<Category[]> {
        const cached = await this.cache.get(this.CACHE_KEY);
        if (cached) {
            return this.convertDatesArray(JSON.parse(cached));
        }

        const categories = await this.prisma.category.findMany();
        await this.cache.set(this.CACHE_KEY, JSON.stringify(categories));
        return categories;
    }

    async findById(id: string): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const category = await this.prisma.category.create({
            data: dto,
        });

        await this.cache.del(this.CACHE_KEY);
        this.categoryGateway.emitNewCategory(category);

        return category;
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.prisma.category.update({
            where: { id },
            data: dto,
        });

        await this.cache.del(this.CACHE_KEY);
        this.categoryGateway.emitNewCategory(category);

        return category;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.delete({
            where: { id },
        });

        await this.cache.del(this.CACHE_KEY);
        this.categoryGateway.emitCategoryDeleted(id);
    }
} 