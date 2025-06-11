import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'O nome é obrigatório'),
    description: z.string().optional().or(z.literal('')),
    price: z.number().positive('O preço deve ser um número positivo'),
    quantity: z.number().int().min(0, 'A quantidade deve ser um número inteiro não negativo'),
    categoryId: z.string().min(1, 'A categoria é obrigatória'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;

export const CreateProductDto = z.object({
    name: z.string()
        .min(1, 'Nome é obrigatório')
        .max(100, 'Nome não pode ter mais que 100 caracteres'),
    price: z.number()
        .min(0.01, 'Preço deve ser maior que 0')
        .max(999999.99, 'Preço não pode ser maior que 999.999,99'),
    quantity: z.number()
        .int()
        .min(0, 'Quantidade não pode ser negativa')
        .max(10000, 'Quantidade não pode ser maior que 10.000'),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

export const UpdateProductDto = CreateProductDto.partial();

export const CreateCategoryDto = CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});

export const UpdateCategoryDto = CreateCategoryDto.partial();

export type CreateProductDtoType = z.infer<typeof CreateProductDto>;
export type UpdateProductDtoType = z.infer<typeof UpdateProductDto>; 