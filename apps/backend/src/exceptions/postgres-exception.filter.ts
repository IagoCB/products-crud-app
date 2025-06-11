import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

@Catch(Error)
export class PostgresExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(PostgresExceptionFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Verifica se o erro é relacionado ao Prisma/PostgreSQL
        if (!exception.message.includes('Prisma') && !exception.message.includes('PostgreSQL')) {
            return;
        }

        this.logger.error(`PostgreSQL Error: ${exception.message}`);

        response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: 'Serviço de banco de dados indisponível',
            details: exception.message,
        });
    }
} 