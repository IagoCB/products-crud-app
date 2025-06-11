import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit {
    private client: ReturnType<typeof createClient>;

    constructor(private configService: ConfigService) {
        this.client = createClient({
            url: this.configService.get('REDIS_URL'),
        });
    }

    async onModuleInit() {
        await this.client.connect();
        this.client.on('error', (err) => console.error('Redis Client Error', err));
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds = 60): Promise<void> {
        await this.client.set(key, value, { EX: ttlSeconds });
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}
