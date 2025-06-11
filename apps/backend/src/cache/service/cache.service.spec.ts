import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  createdAt: Date;
}

jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

describe('CacheService', () => {
  let service: CacheService;
  let mockRedisClient: any;

  beforeEach(async () => {
    mockRedisClient = {
      connect: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      on: jest.fn(),
    };

    (createClient as jest.Mock).mockReturnValue(mockRedisClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'REDIS_HOST':
                  return 'localhost';
                case 'REDIS_PORT':
                  return 6379;
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return cached data when available', async () => {
      const mockData = JSON.stringify({ id: '1', name: 'Test Product' });
      mockRedisClient.get.mockResolvedValue(mockData);

      const result = await service.get('test-key');
      expect(result).toBe(mockData);
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when no data is cached', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set data in cache', async () => {
      const mockData = { id: '1', name: 'Test Product' };
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set('test-key', JSON.stringify(mockData));
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(mockData),
        { EX: 60 }
      );
    });
  });

  describe('del', () => {
    it('should delete data from cache', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      await service.del('test-key');
      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
    });
  });
});
