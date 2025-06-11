import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';

describe('AllExceptionsFilter', () => {
    let filter: AllExceptionsFilter;
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<Request>;
    let mockHost: Partial<ArgumentsHost>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AllExceptionsFilter],
        }).compile();

        filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

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

    it('should handle HttpException', () => {
        const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: HttpStatus.BAD_REQUEST,
            timestamp: expect.any(String),
            path: '/test',
            error: 'Test error',
        });
    });

    it('should handle unknown exceptions', () => {
        const exception = new Error('Unknown error');

        filter.catch(exception, mockHost as ArgumentsHost);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: expect.any(String),
            path: '/test',
            error: exception,
        });
    });
}); 