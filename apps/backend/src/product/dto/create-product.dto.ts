import { IsString, IsNumber, IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Nome do produto',
        example: 'Smartphone XYZ'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Preço do produto',
        minimum: 0,
        example: 999.99
    })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        description: 'Quantidade em estoque',
        minimum: 0,
        example: 10
    })
    @IsInt()
    @Min(0)
    quantity: number;

    @ApiProperty({
        description: 'ID da categoria do produto',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    categoryId: string;
}