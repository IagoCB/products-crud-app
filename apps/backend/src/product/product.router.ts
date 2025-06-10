import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from '../../../../packages/types/src/index';

export function createProductRouter(productService: ProductService) {
    return router({
        getAll: publicProcedure.query(async () => {
            return productService.findAll();
        }),
        getById: publicProcedure.input(z.string()).query(async ({ input }) => {
            return productService.findById(input);
        }),
        create: publicProcedure.input(CreateProductDto).mutation(async ({ input }) => {
            return productService.create(input);
        }),
        update: publicProcedure.input(z.object({ id: z.string() }).merge(UpdateProductDto)).mutation(async ({ input }) => {
            const { id, ...data } = input;
            return productService.update(id, data);
        }),
        delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
            return productService.delete(input);
        }),
    });
} 