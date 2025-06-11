import { ApiProperty } from '@nestjs/swagger';

class ProductResponseDto {
    @ApiProperty({
        description: 'ID do produto',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Nome do produto',
        example: 'Smartphone XYZ'
    })
    name: string;

    @ApiProperty({
        description: 'Preço do produto',
        example: 999.99
    })
    price: number;

    @ApiProperty({
        description: 'Quantidade em estoque',
        example: 10
    })
    quantity: number;
}

export class CategoryResponseDto {
    @ApiProperty({
        description: 'ID da categoria',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Nome da categoria',
        example: 'Eletrônicos'
    })
    name: string;

    @ApiProperty({
        description: 'Lista de produtos da categoria',
        type: [ProductResponseDto]
    })
    products: ProductResponseDto[];
} 