import { IsString, IsNumber, IsInt, IsUUID, Min, Max, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Nome do produto',
        example: 'Smartphone XYZ',
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Preço do produto',
        minimum: 0.01,
        maximum: 999999.99,
        example: 999.99
    })
    @IsNumber()
    @Min(0.01)
    @Max(999999.99)
    price: number;

    @ApiProperty({
        description: 'Quantidade em estoque',
        minimum: 0,
        maximum: 10000,
        example: 10
    })
    @IsInt()
    @Min(0)
    @Max(10000)
    quantity: number;

    @ApiProperty({
        description: 'ID da categoria do produto',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    categoryId: string;
}