import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class RedisExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(RedisExceptionFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Verifica se o erro é relacionado ao Redis
        if (!exception.message.includes('Redis'))
            return;

        this.logger.error(`Redis Error: ${exception.message}`);

        response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: 'Serviço de cache indisponível',
            details: exception.message,
        });
    }
} 