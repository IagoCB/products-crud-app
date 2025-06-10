import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCategory: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100, quantity: 10, categoryId: '1' },
        { id: '2', name: 'Product 2', price: 200, quantity: 20, categoryId: '1' },
      ];

      mockProductService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();
      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a single product', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        price: 100,
        quantity: 10,
        categoryId: '1',
      };

      mockProductService.findById.mockResolvedValue(mockProduct);

      const result = await controller.findById('1');
      expect(result).toEqual(mockProduct);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100, quantity: 10, categoryId: '1' },
        { id: '2', name: 'Product 2', price: 200, quantity: 20, categoryId: '1' },
      ];

      mockProductService.findByCategory.mockResolvedValue(mockProducts);

      const result = await controller.findByCategory('1');
      expect(result).toEqual(mockProducts);
      expect(service.findByCategory).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        price: 150,
        quantity: 15,
        categoryId: '1',
      };

      const createdProduct = { id: '1', ...createProductDto };

      mockProductService.create.mockResolvedValue(createdProduct);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(createdProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
        quantity: 25,
        categoryId: '1',
      };

      const updatedProduct = { id: '1', ...updateProductDto };

      mockProductService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      mockProductService.delete.mockResolvedValue(undefined);

      await controller.delete('1');
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
