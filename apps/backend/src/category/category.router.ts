import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../../packages/types/src/index';

export function createCategoryRouter(categoryService: CategoryService) {
    return router({
        getAll: publicProcedure.query(async () => {
            return categoryService.findAll();
        }),
        getById: publicProcedure.input(z.string()).query(async ({ input }) => {
            return categoryService.findById(input);
        }),
        create: publicProcedure.input(CreateCategoryDto).mutation(async ({ input }) => {
            return categoryService.create(input);
        }),
        update: publicProcedure.input(z.object({ id: z.string() }).merge(UpdateCategoryDto)).mutation(async ({ input }) => {
            const { id, ...data } = input;
            return categoryService.update(id, data);
        }),
        delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
            return categoryService.delete(input);
        }),
    });
} 