import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductGateway } from './product.gateway';
import { Product } from '@prisma/client';
import { CacheService } from '../cache/cache.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    private readonly CACHE_KEY = 'products:all';

    constructor(private readonly prisma: PrismaService, private readonly productGateway: ProductGateway, private readonly cache: CacheService) { }

    private convertDates(product: any): Product {
        return {
            ...product,
            createdAt: new Date(product.createdAt),
        };
    }

    private convertDatesArray(products: any[]): Product[] {
        return products.map(product => this.convertDates(product));
    }

    async create(dto: CreateProductDto) {
        const product = await this.prisma.product.create({
            data: dto,
        });
        await this.cache.del(this.CACHE_KEY);
        this.productGateway.emitNewProduct(product);
        return product;
    }

    async findAll(): Promise<Product[]> {
        const cachedProducts = await this.cache.get(this.CACHE_KEY);
        if (cachedProducts) {
            return this.convertDatesArray(JSON.parse(cachedProducts));
        }

        const products = await this.prisma.product.findMany();
        await this.cache.set(this.CACHE_KEY, JSON.stringify(products));

        return products;
    }

    async findById(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Produto não encontrado');
        return product;
    }

    async findByCategory(categoryId: string) {
        return this.prisma.product.findMany({
            where: { categoryId },
        });
    }

    async update(id: string, dto: UpdateProductDto): Promise<Product> {
        const updated = await this.prisma.product.update({
            where: { id },
            data: dto,
        });
        await this.cache.del(this.CACHE_KEY);
        this.productGateway.emitNewProduct(updated);
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.product.delete({ where: { id } });
        await this.cache.del(this.CACHE_KEY);
        this.productGateway.emitProductDeleted(id);
    }
}
