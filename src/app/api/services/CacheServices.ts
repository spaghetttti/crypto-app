type CacheItem<T> = {
  value: T;
  expiry: number;
};

export class CacheService<T> {
  private cache: Map<string, CacheItem<T>>;
  private cacheDuration: number; // Cache duration in milliseconds

  constructor(cacheDuration: number) {
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  async getCachedData(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (item && Date.now() < item.expiry) {
      return item.value;
    }

    this.cache.delete(key);
    return null;
  }

  async setCache(key: string, value: T): Promise<void> {
    const expiry = Date.now() + this.cacheDuration;
    this.cache.set(key, { value, expiry });
  }

  clear(): void {
    this.cache.clear();
  }
}
