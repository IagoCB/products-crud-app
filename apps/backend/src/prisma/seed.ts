import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCategories() {
    const categories = [
        { name: 'Bebidas' },
        { name: 'Alimentos' },
        { name: 'Limpeza' },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: { name: category.name },
        });
    }

    console.log('✅ Categorias seed executado');
}
