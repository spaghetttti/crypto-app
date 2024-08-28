import Redis from "ioredis";

export class CacheService<T> {
  private redis: Redis;
  private cacheDuration: number;

  constructor(cacheDuration: number = 3000) {
    this.redis = new Redis(process.env.REDIS_URL as string);
    this.cacheDuration = cacheDuration;
  }

  async getCachedData(key: string): Promise<T | null> {
    const cachedData = await this.redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }

  async setCache(key: string, data: T): Promise<void> {
    await this.redis.set(
      key,
      JSON.stringify(data),
      "EX",
      this.cacheDuration / 1000
    ); // Set with expiration
  }

  async clearCache(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async clearAllCaches(): Promise<void> {
    await this.redis.flushall();
  }
}
