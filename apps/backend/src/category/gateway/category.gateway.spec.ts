import { Test, TestingModule } from '@nestjs/testing';
import { CategoryGateway } from './category.gateway';
import { Category } from '@prisma/client';

describe('CategoryGateway', () => {
    let gateway: CategoryGateway;

    const mockServer = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryGateway],
        }).compile();

        gateway = module.get<CategoryGateway>(CategoryGateway);
        gateway.server = mockServer as any;
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    describe('emitNewCategory', () => {
        it('should emit new category event', () => {
            const mockCategory: Category = {
                id: '1',
                name: 'Test Category',
            };

            gateway.emitNewCategory(mockCategory);

            expect(mockServer.emit).toHaveBeenCalledWith('category_created', mockCategory);
        });
    });

    describe('emitCategoryDeleted', () => {
        it('should emit category deleted event', () => {
            const categoryId = '1';

            gateway.emitCategoryDeleted(categoryId);

            expect(mockServer.emit).toHaveBeenCalledWith('category_deleted', categoryId);
        });
    });
}); 