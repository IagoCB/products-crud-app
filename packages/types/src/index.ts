import { z } from 'zod';

// Schemas
export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    categoryId: z.string(),
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
export const CreateProductDto = ProductSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
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