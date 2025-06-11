import { Test, TestingModule } from '@nestjs/testing';
import { CategoryGateway } from './category.gateway';
import { CategoryResponseDto } from '../dto/category-response.dto';

describe('CategoryGateway', () => {
    let gateway: CategoryGateway;
    let mockServer: { emit: jest.Mock };

    beforeEach(async () => {
        mockServer = { emit: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryGateway,
            ],
        }).compile();

        gateway = module.get<CategoryGateway>(CategoryGateway);
        gateway.server = mockServer as any;
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });

    it('should emit new category event', () => {
        const mockCategory: CategoryResponseDto = {
            id: 'some-id',
            name: 'some-name',
            products: [],
        };
        gateway.emitNewCategory(mockCategory);
        expect(mockServer.emit).toHaveBeenCalledWith('category_created', mockCategory);
    });

    it('should emit category deleted event', () => {
        const categoryId = 'some-id';
        gateway.emitCategoryDeleted(categoryId);
        expect(mockServer.emit).toHaveBeenCalledWith('category_deleted', categoryId);
    });
}); 