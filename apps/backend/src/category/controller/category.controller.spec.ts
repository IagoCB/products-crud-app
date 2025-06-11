import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './service/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoryController', () => {
    let controller: CategoryController;
    let service: CategoryService;

    const mockCategoryService = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                {
                    provide: CategoryService,
                    useValue: mockCategoryService,
                },
            ],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
        service = module.get<CategoryService>(CategoryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            const mockCategories = [
                { id: '1', name: 'Category 1', createdAt: new Date() },
                { id: '2', name: 'Category 2', createdAt: new Date() },
            ];

            mockCategoryService.findAll.mockResolvedValue(mockCategories);

            const result = await controller.findAll();
            expect(result).toEqual(mockCategories);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a category by id', async () => {
            const mockCategory = {
                id: '1',
                name: 'Category 1',
                createdAt: new Date(),
            };

            mockCategoryService.findById.mockResolvedValue(mockCategory);

            const result = await controller.findById('1');
            expect(result).toEqual(mockCategory);
            expect(service.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const createCategoryDto: CreateCategoryDto = {
                name: 'New Category',
            };

            const mockCreatedCategory = {
                id: '1',
                ...createCategoryDto,
                createdAt: new Date(),
            };

            mockCategoryService.create.mockResolvedValue(mockCreatedCategory);

            const result = await controller.create(createCategoryDto);
            expect(result).toEqual(mockCreatedCategory);
            expect(service.create).toHaveBeenCalledWith(createCategoryDto);
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            const updateCategoryDto: UpdateCategoryDto = {
                name: 'Updated Category',
            };

            const mockUpdatedCategory = {
                id: '1',
                ...updateCategoryDto,
                createdAt: new Date(),
            };

            mockCategoryService.update.mockResolvedValue(mockUpdatedCategory);

            const result = await controller.update('1', updateCategoryDto);
            expect(result).toEqual(mockUpdatedCategory);
            expect(service.update).toHaveBeenCalledWith('1', updateCategoryDto);
        });
    });

    describe('delete', () => {
        it('should delete a category', async () => {
            mockCategoryService.delete.mockResolvedValue(undefined);

            await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith('1');
        });
    });
}); 