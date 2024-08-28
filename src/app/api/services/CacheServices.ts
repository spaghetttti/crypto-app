export class CacheService<T> {
  private cacheMap: Map<string, { data: T; timestamp: number }>;
  private cacheDuration: number;

  constructor(cacheDuration: number = 3000) {
    this.cacheMap = new Map();
    this.cacheDuration = cacheDuration;
  }

  getCachedData(key: string): T | null {
    const cacheEntry = this.cacheMap.get(key);
    if (cacheEntry && Date.now() - cacheEntry.timestamp < this.cacheDuration) {
      return cacheEntry.data;
    }
    return null;
  }

  setCache(key: string, data: T): void {
    this.cacheMap.set(key, { data, timestamp: Date.now() });
  }

  clearCache(key: string): void {
    this.cacheMap.delete(key);
  }

  clearAllCaches(): void {
    this.cacheMap.clear();
  }
}
