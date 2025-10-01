import { Injectable, Inject } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class GeneralCacheService {
  constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.setex(key, ttl, data);
    } else {
      await this.redisClient.set(key, data);
    }
  }

  async get(key: string): Promise<any | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
