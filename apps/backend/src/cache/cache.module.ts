import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './service/cache.service';

@Module({
    imports: [ConfigModule],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule { }