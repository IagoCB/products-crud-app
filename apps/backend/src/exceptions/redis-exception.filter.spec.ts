import { Test, TestingModule } from '@nestjs/testing';
import { RedisExceptionFilter } from './redis-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';

describe('RedisExceptionFilter', () => {
    let filter: RedisExceptionFilter;
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<Request>;
    let mockHost: Partial<ArgumentsHost>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RedisExceptionFilter],
        }).compile();

        filter = module.get<RedisExceptionFilter>(RedisExceptionFilter);

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockRequest = {
            url: '/test',
        };

        mockHost = {
            switchToHttp: jest.fn().mockReturnValue({
                getResponse: () => mockResponse,
                getRequest: () => mockRequest,
            }),
        };
    });

    it('should handle Redis errors', () => {
        const exception = new Error('Redis connection failed');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(503);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: 503,
            timestamp: expect.any(String),
            path: '/test',
            error: 'Serviço de cache indisponível',
            details: 'Redis connection failed',
        });
    });

    it('should ignore non-Redis errors', () => {
        const exception = new Error('Some other error');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
}); 