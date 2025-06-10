import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CategoryGateway } from './category.gateway';
import { NotFoundException } from '@nestjs/common';

interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

describe('CategoryService', () => {
    let service: CategoryService;
    let prismaService: PrismaService;
    let cacheService: CacheService;
    let categoryGateway: CategoryGateway;

    const mockPrismaService = {
        category: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockCacheService = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    const mockCategoryGateway = {
        emitNewCategory: jest.fn(),
        emitCategoryDeleted: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: CacheService,
                    useValue: mockCacheService,
                },
                {
                    provide: CategoryGateway,
                    useValue: mockCategoryGateway,
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        prismaService = module.get<PrismaService>(PrismaService);
        cacheService = module.get<CacheService>(CacheService);
        categoryGateway = module.get<CategoryGateway>(CategoryGateway);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return cached categories when available', async () => {
            const mockCategories: Category[] = [
                {
                    id: '1',
                    name: 'Category 1',
                    description: 'Description 1',
                    createdAt: new Date('2025-06-10T13:21:32.926Z')
                },
                {
                    id: '2',
                    name: 'Category 2',
                    description: 'Description 2',
                    createdAt: new Date('2025-06-10T13:21:32.926Z')
                },
            ];

            mockCacheService.get.mockResolvedValue(JSON.stringify(mockCategories));

            const result = await service.findAll();
            expect(result).toEqual(mockCategories);
            expect(mockCacheService.get).toHaveBeenCalledWith('categories:all');
        });

        it('should fetch from database and cache when no cache available', async () => {
            const mockCategories: Category[] = [
                {
                    id: '1',
                    name: 'Category 1',
                    description: 'Description 1',
                    createdAt: new Date('2025-06-10T13:21:32.926Z')
                },
                {
                    id: '2',
                    name: 'Category 2',
                    description: 'Description 2',
                    createdAt: new Date('2025-06-10T13:21:32.926Z')
                },
            ];

            mockCacheService.get.mockResolvedValue(null);
            mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

            const result = await service.findAll();
            expect(result).toEqual(mockCategories);
            expect(mockPrismaService.category.findMany).toHaveBeenCalled();
            expect(mockCacheService.set).toHaveBeenCalledWith('categories:all', JSON.stringify(mockCategories));
        });
    });

    describe('findById', () => {
        it('should return a category when found', async () => {
            const mockCategory: Category = {
                id: '1',
                name: 'Category 1',
                description: 'Description 1',
                createdAt: new Date('2025-06-10T13:21:32.926Z')
            };

            mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

            const result = await service.findById('1');
            expect(result).toEqual(mockCategory);
            expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should throw NotFoundException when category not found', async () => {
            mockPrismaService.category.findUnique.mockResolvedValue(null);

            await expect(service.findById('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const newCategory = {
                name: 'New Category',
                description: 'New Description',
            };

            const createdCategory: Category = {
                id: '1',
                ...newCategory,
                createdAt: new Date('2025-06-10T13:21:32.926Z')
            };

            mockPrismaService.category.create.mockResolvedValue(createdCategory);

            const result = await service.create(newCategory);
            expect(result).toEqual(createdCategory);
            expect(mockPrismaService.category.create).toHaveBeenCalledWith({
                data: newCategory,
            });
            expect(mockCacheService.del).toHaveBeenCalledWith('categories:all');
            expect(mockCategoryGateway.emitNewCategory).toHaveBeenCalledWith(createdCategory);
        });
    });

    describe('update', () => {
        it('should update an existing category', async () => {
            const updateData = {
                name: 'Updated Category',
                description: 'Updated Description',
            };

            const updatedCategory: Category = {
                id: '1',
                ...updateData,
                createdAt: new Date('2025-06-10T13:21:32.926Z')
            };

            mockPrismaService.category.update.mockResolvedValue(updatedCategory);

            const result = await service.update('1', updateData);
            expect(result).toEqual(updatedCategory);
            expect(mockPrismaService.category.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateData,
            });
            expect(mockCacheService.del).toHaveBeenCalledWith('categories:all');
            expect(mockCategoryGateway.emitNewCategory).toHaveBeenCalledWith(updatedCategory);
        });
    });

    describe('delete', () => {
        it('should delete a category', async () => {
            mockPrismaService.category.delete.mockResolvedValue(undefined);

            await service.delete('1');
            expect(mockPrismaService.category.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(mockCacheService.del).toHaveBeenCalledWith('categories:all');
            expect(mockCategoryGateway.emitCategoryDeleted).toHaveBeenCalledWith('1');
        });
    });
}); 