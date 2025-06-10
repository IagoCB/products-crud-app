import * as express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ProductService } from './product/product.service';
import { createProductRouter } from './product/product.router';
import { PrismaService } from './prisma/prisma.service';
import { ProductGateway } from './product/product.gateway';
import { CacheService } from './cache/cache.service';
import { CategoryService } from './category/category.service';
import { createCategoryRouter } from './category/category.router';
import { ConfigService } from '@nestjs/config';

export const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

// Instanciar dependências do ProductService
const prisma = new PrismaService();
const productGateway = new ProductGateway();
const configService = new ConfigService();
const cache = new CacheService(configService);
const productService = new ProductService(prisma, productGateway, cache);
const categoryService = new CategoryService(prisma, cache, undefined as any);

// Exemplo de router base (será expandido para produto e categoria)
export const appRouter = router({
    produto: createProductRouter(productService),
    categoria: createCategoryRouter(categoryService),
    health: publicProcedure.query(() => 'ok'),
});

export function createTrpcExpressApp(
    productService: ProductService,
    categoryService: CategoryService
) {
    const appRouter = router({
        produto: createProductRouter(productService),
        categoria: createCategoryRouter(categoryService),
        health: publicProcedure.query(() => 'ok'),
    });

    const app = express();
    app.use('/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: () => ({}),
    }));
    return app;
} 