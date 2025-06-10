import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string): Promise<Product> {
        return this.productService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<void> {
        return this.productService.delete(id);
    }
}
