import { z } from 'zod';

// Schemas
export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "O nome é obrigatório"),
    description: z.string().optional().or(z.literal('')),
    price: z.number().positive("O preço deve ser um número positivo"),
    quantity: z.number().int().min(0, "A quantidade deve ser um número inteiro não negativo"),
    categoryId: z.string().min(1, "A categoria é obrigatória"),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CategorySchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Types
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;

// DTOs
export const CreateProductDto = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    price: z.number().min(0.01, "Preço deve ser maior que 0"),
    quantity: z.number().int().min(0, "Quantidade não pode ser negativa"),
    categoryId: z.string().min(1, "Categoria é obrigatória"),
});

export const UpdateProductDto = CreateProductDto.partial();

export const CreateCategoryDto = CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});

export const UpdateCategoryDto = CreateCategoryDto.partial();

// Router Types
export type AppRouter = {
    produto: {
        getAll: () => Promise<Product[]>;
        getById: (id: string) => Promise<Product>;
        create: (data: z.infer<typeof CreateProductDto>) => Promise<Product>;
        update: (data: { id: string } & z.infer<typeof UpdateProductDto>) => Promise<Product>;
        delete: (id: string) => Promise<Product>;
        onProdutoChanged: () => void;
    };
    categoria: {
        getAll: () => Promise<Category[]>;
        getById: (id: string) => Promise<Category>;
        create: (data: z.infer<typeof CreateCategoryDto>) => Promise<Category>;
        update: (data: { id: string } & z.infer<typeof UpdateCategoryDto>) => Promise<Category>;
        delete: (id: string) => Promise<Category>;
        onCategoriaChanged: () => void;
    };
};

export type CreateProductDtoType = z.infer<typeof CreateProductDto>;
export type UpdateProductDtoType = z.infer<typeof UpdateProductDto>; 