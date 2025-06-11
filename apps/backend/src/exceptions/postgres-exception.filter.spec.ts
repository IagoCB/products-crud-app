import { Test, TestingModule } from '@nestjs/testing';
import { PostgresExceptionFilter } from './postgres-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';

describe('PostgresExceptionFilter', () => {
    let filter: PostgresExceptionFilter;
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<Request>;
    let mockHost: Partial<ArgumentsHost>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PostgresExceptionFilter],
        }).compile();

        filter = module.get<PostgresExceptionFilter>(PostgresExceptionFilter);

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

    it('should handle Prisma errors', () => {
        const exception = new Error('Prisma connection failed');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(503);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: 503,
            timestamp: expect.any(String),
            path: '/test',
            error: 'Serviço de banco de dados indisponível',
            details: 'Prisma connection failed',
        });
    });

    it('should handle PostgreSQL errors', () => {
        const exception = new Error('PostgreSQL connection failed');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(503);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: 503,
            timestamp: expect.any(String),
            path: '/test',
            error: 'Serviço de banco de dados indisponível',
            details: 'PostgreSQL connection failed',
        });
    });

    it('should ignore non-database errors', () => {
        const exception = new Error('Some other error');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
}); 