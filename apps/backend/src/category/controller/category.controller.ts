import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '../service/category.service';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('categorias')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @ApiOperation({ summary: 'Criar uma nova categoria' })
    @ApiResponse({ status: 201, description: 'Categoria criada com sucesso', type: CreateCategoryDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as categorias' })
    @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso', type: [CreateCategoryDto] })
    async findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar categoria por ID' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    @ApiResponse({ status: 200, description: 'Categoria encontrada com sucesso', type: CreateCategoryDto })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    findById(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar uma categoria' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso', type: CreateCategoryDto })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<Category> {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover uma categoria' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    delete(@Param('id') id: string): Promise<void> {
        return this.categoryService.delete(id);
    }
} 