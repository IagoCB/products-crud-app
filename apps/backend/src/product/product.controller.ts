import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('produtos')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo produto' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: CreateProductDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os produtos' })
    @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso', type: [CreateProductDto] })
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar produto por ID' })
    @ApiParam({ name: 'id', description: 'ID do produto' })
    @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso', type: CreateProductDto })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    findById(@Param('id') id: string): Promise<Product> {
        return this.productService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um produto' })
    @ApiParam({ name: 'id', description: 'ID do produto' })
    @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso', type: CreateProductDto })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover um produto' })
    @ApiParam({ name: 'id', description: 'ID do produto' })
    @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    delete(@Param('id') id: string): Promise<void> {
        return this.productService.delete(id);
    }
}
