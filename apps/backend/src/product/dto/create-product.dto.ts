import { IsString, IsNumber, IsInt, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    quantity: number;

    @IsUUID()
    categoryId: string;
}