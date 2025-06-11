import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../service/product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../cache/service/cache.service';
import { ProductGateway } from '../gateway/product.gateway';
import { NotFoundException } from '@nestjs/common';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  createdAt: Date;
}

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: PrismaService;
  let cacheService: CacheService;
  let productGateway: ProductGateway;

  const mockPrismaService = {
    product: {
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

  const mockProductGateway = {
    emitNewProduct: jest.fn(),
    emitProductDeleted: jest.fn(),
    emitProductUpdated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: ProductGateway,
          useValue: mockProductGateway,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
    productGateway = module.get<ProductGateway>(ProductGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cached products when available', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 10,
          categoryId: '1',
          createdAt: new Date('2025-06-10T13:21:32.926Z')
        },
        {
          id: '2',
          name: 'Product 2',
          price: 200,
          quantity: 20,
          categoryId: '1',
          createdAt: new Date('2025-06-10T13:21:32.926Z')
        },
      ];

      mockCacheService.get.mockResolvedValue(JSON.stringify(mockProducts));

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
      expect(mockCacheService.get).toHaveBeenCalledWith('products:all');
    });

    it('should fetch from database and cache when no cache available', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 10,
          categoryId: '1',
          createdAt: new Date('2025-06-10T13:21:32.926Z')
        },
        {
          id: '2',
          name: 'Product 2',
          price: 200,
          quantity: 20,
          categoryId: '1',
          createdAt: new Date('2025-06-10T13:21:32.926Z')
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalledWith('products:all', JSON.stringify(mockProducts));
    });
  });

  describe('findById', () => {
    it('should return a product when found', async () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 10,
        categoryId: '1',
        createdAt: new Date('2025-06-10T13:21:32.926Z')
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findById('1');
      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 10,
          categoryId: '1',
          createdAt: new Date('2025-06-10T13:21:32.926Z')
        },
        {
          id: '2',
          name: 'Product 2',
          price: 200,
          quantity: 20,
          categoryId: '1',
          createdAt: new Date('2025-06-10T13:21:32.926Z')
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findByCategory('1');
      expect(result).toEqual(mockProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        price: 150,
        quantity: 15,
        categoryId: '1',
      };

      const createdProduct: Product = {
        id: '1',
        ...newProduct,
        createdAt: new Date('2025-06-10T13:21:32.926Z')
      };

      mockPrismaService.product.create.mockResolvedValue(createdProduct);

      const result = await service.create(newProduct);
      expect(result).toEqual(createdProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: newProduct,
      });
      expect(mockCacheService.del).toHaveBeenCalledWith('products:all');
      expect(mockProductGateway.emitNewProduct).toHaveBeenCalledWith(createdProduct);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 200,
        quantity: 25,
        categoryId: '1',
      };

      const updatedProduct: Product = {
        id: '1',
        ...updateData,
        createdAt: new Date('2025-06-10T13:21:32.926Z')
      };

      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updateData);
      expect(result).toEqual(updatedProduct);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(mockCacheService.del).toHaveBeenCalledWith('products:all');
      expect(mockProductGateway.emitProductUpdated).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      mockPrismaService.product.delete.mockResolvedValue(undefined);

      await service.delete('1');
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockCacheService.del).toHaveBeenCalledWith('products:all');
      expect(mockProductGateway.emitProductDeleted).toHaveBeenCalledWith('1');
    });
  });
});
