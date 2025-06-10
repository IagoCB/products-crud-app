import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis();
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds = 60): Promise<void> {
        await this.client.set(key, value, 'EX', ttlSeconds);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}
