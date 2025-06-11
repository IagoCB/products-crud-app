import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '../service/category.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiTags('categorias')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @ApiOperation({ summary: 'Criar uma nova categoria' })
    @ApiResponse({
        status: 201,
        description: 'Categoria criada com sucesso',
        type: CategoryResponseDto
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as categorias' })
    @ApiResponse({
        status: 200,
        description: 'Lista de categorias retornada com sucesso',
        type: [CategoryResponseDto]
    })
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar categoria por ID' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    @ApiResponse({
        status: 200,
        description: 'Categoria encontrada com sucesso',
        type: CategoryResponseDto
    })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    async findById(@Param('id') id: string) {
        return this.categoryService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar uma categoria' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    @ApiResponse({
        status: 200,
        description: 'Categoria atualizada com sucesso',
        type: CategoryResponseDto
    })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir uma categoria' })
    @ApiParam({ name: 'id', description: 'ID da categoria' })
    @ApiResponse({ status: 200, description: 'Categoria excluída com sucesso' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    async delete(@Param('id') id: string) {
        return this.categoryService.delete(id);
    }
} 