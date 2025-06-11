import { Test, TestingModule } from '@nestjs/testing';
import { ProductGateway } from './product.gateway';
import { Product } from '@prisma/client';

describe('ProductGateway', () => {
  let gateway: ProductGateway;
  let mockServer: { emit: jest.Mock };

  beforeEach(async () => {
    mockServer = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductGateway],
    }).compile();

    gateway = module.get<ProductGateway>(ProductGateway);
    gateway.server = mockServer as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit new product event', () => {
    const mockProduct: Product = {
      id: 'some-product-id-1',
      name: 'Test Product 1',
      price: 100.00,
      quantity: 10,
      categoryId: 'some-category-id',
      createdAt: new Date(),
    };
    gateway.emitNewProduct(mockProduct);
    expect(mockServer.emit).toHaveBeenCalledWith('product_created', mockProduct);
  });

  it('should emit product deleted event', () => {
    const productId = 'some-product-id-2';
    gateway.emitProductDeleted(productId);
    expect(mockServer.emit).toHaveBeenCalledWith('product_deleted', productId);
  });

  it('should emit product updated event', () => {
    const mockProduct: Product = {
      id: 'some-product-id-3',
      name: 'Updated Product 3',
      price: 150.00,
      quantity: 5,
      categoryId: 'some-category-id',
      createdAt: new Date(),
    };
    gateway.emitProductUpdated(mockProduct);
    expect(mockServer.emit).toHaveBeenCalledWith('product_updated', mockProduct);
  });
});
